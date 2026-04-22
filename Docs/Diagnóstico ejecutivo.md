
## Diagnóstico ejecutivo

**Estado actual: rojo.**

No lo describiría como “un servicio con algunos bugs”, sino como una solución partida en varias direcciones:

* un **backend Express** con vistas Handlebars para admin y endpoints JSON;
* un **frontend Next.js**;
* pero además hay **dos frontends duplicados** en el mismo repo: uno en la raíz y otro en `/front`;
* y encima hay **conflictos de merge sin resolver** incrustados en archivos fuente.

Eso implica que hoy el principal problema no es una función aislada, sino la **falta de una fuente canónica del sistema**.

## Qué arquitectura tiene realmente hoy

Lo que hay hoy es esto:

* **Backend**: Express 4 + MySQL + sesión + Handlebars para admin.
* **Frontend público**: Next.js App Router.
* **Modelo de integración**: el frontend consume `/api/novedades` y `/api/contacto`.
* **Persistencia**: MySQL.
* **Infra externa**: SMTP y Cloudinary por variables de entorno.

El problema es que esa separación no está bien cerrada. No hay un contrato estable entre frontend, backend y base de datos.

---

## Hallazgos críticos

### 1) El frontend está roto a nivel fuente

Hay conflictos de merge visibles dentro del código.

Archivos afectados, entre otros:

* `src/app/page.js`
* `src/app/home1.css`
* `src/components/NovedadItem.js`

Ejemplos concretos:

* `src/app/page.js:73-88`
* `src/app/page.js:140-179`
* `src/app/page.js:195-203`
* `src/components/NovedadItem.js:41-57`

Aparecen marcadores como:

* `<<<<<<< HEAD`
* `=======`
* `>>>>>>> c0c8bc3 (fix case sensitive import)`

Esto no es un detalle menor: **ese frontend no está en estado compilable/confiable**.

### 2) Hay una corrección de case-sensitivity mal resuelta

Este parece ser el origen de parte del conflicto.

Ejemplos:

* `src/app/page.js:7` importa `@/components/ContactForm`
* el archivo real en la raíz es `src/components/contactForm.js`

Y además:

* `src/app/contacto/page.js:2` importa `contactForm`
* `src/app/contacto/page.js:21` usa `<contactForm ... />`

Eso rompe de dos maneras:

1. en Linux/Vercel, `ContactForm` vs `contactForm` puede fallar por mayúsculas/minúsculas;
2. en React, un tag en minúscula como `<contactForm />` se interpreta como **elemento HTML custom**, no como componente React.

Resultado: aunque el archivo existiera, esa pantalla de contacto está mal armada.

### 3) Hay dos frontends canónicos compitiendo entre sí

En el repo hay frontend duplicado:

* `src/`, `public/`, `package.json` en la raíz
* `front/src/`, `front/public/`, `front/package.json`

Y no son idénticos.

Ejemplo fuerte:

* `package.json` raíz usa `next 14.2.7`, `react 18.2.0`
* `front/package.json` usa `next 15.5.11`, `react 19.1.0`

Eso significa que hoy no hay claridad sobre:

* cuál es el frontend real;
* cuál se despliega;
* cuál se edita;
* cuál refleja el último estado correcto.

Arquitectónicamente, esto es **split-brain del repositorio**.

### 4) El contrato de datos está roto entre código y base

Este es uno de los problemas más serios.

Hay al menos **tres modelos de datos distintos** para `novedades`:

#### a) `back/novedades_schema.sql`

Define:

* `titulo`
* `subtitulo`
* `cuerpo`

#### b) `database/database.sql`

Inserta usando:

* `titulo`
* `descripcion`
* `fecha_publicacion`
* `estado`

#### c) El backend/admin (`back/routes/admin/novedades.js`)

trabaja con:

* `titulo`
* `descripcion`
* `fecha_publicacion`
* `estado`

#### d) El API (`back/routes/api.js`)

además espera:

* `img_id`

#### e) El frontend (`src/app/novedades/page.js`)

también usa:

* `link`
* `imagen`

Conclusión: **no hay un esquema único**.

Consecuencias posibles:

* si se crea la tabla con `back/novedades_schema.sql`, el admin y el frontend quedan incompatibles;
* si se usa `database/database.sql`, el API no tiene `img_id`;
* el frontend espera campos que el backend no garantiza.

Esto no es solo deuda técnica: es **inconsistencia funcional**.

---

## Hallazgos de backend

### 5) Seguridad de autenticación deficiente

En `back/models/usuariosModel.js` se usa `md5(password)`.

Eso hoy es una mala práctica fuerte para contraseñas.
MD5 no debe usarse para hashing de credenciales.

Corresponde migrar a:

* `bcrypt`
  o
* `argon2`

### 6) El secreto de sesión está hardcodeado

En `back/app.js:31-36`:

* `secret: 'Cursos2026'`

Eso es un riesgo claro. Debe salir a variable de entorno.

Además:

* no hay store persistente de sesión;
* al no configurarse store, queda el store por defecto en memoria;
* eso no es apropiado para producción.

### 7) `saveUninitialized: true` y cookies sin endurecimiento

En `back/app.js`:

* `saveUninitialized: true`
* no veo endurecimiento de cookie tipo `httpOnly`, `secure`, `sameSite`

Para un panel admin con login, esto necesita revisión.

### 8) CORS abierto sin política explícita

`back/app.js:55` usa:

* `app.use('/api', cors(), apiRouter);`

Eso abre CORS sin whitelist.
En un entorno simple puede “funcionar”, pero no es una política seria.

### 9) Errores async mal manejados en Express 4

En `back/routes/api.js`, los handlers son `async`, pero no están envueltos con manejo de errores.

Ejemplos:

* `GET /api/novedades`
* `POST /api/contacto`

Si falla MySQL, SMTP o Cloudinary, no hay manejo consistente.
En Express 4, los errores de async handlers no siempre quedan bien capturados sin wrapper o `try/catch`.

### 10) Bug real de sesión/nombre de usuario

En login:

* `back/routes/admin/login.js:29-30`

  * guarda `req.session.id_nombre = data.usuario`

Pero en admin:

* `back/routes/admin/novedades.js:11-18`

  * lee `req.session.nombre`

Eso no coincide.
El nombre del usuario probablemente no se muestra nunca.

### 11) Variable global implícita

En `back/app.js:38`:

* `secured = async (...) => { ... }`

Falta `const` o `var`.
Eso crea una global implícita en CommonJS no estricto.

No suele romper de inmediato, pero es un olor claro de calidad.

### 12) El manejo de errores del modelo de usuarios está roto

En `back/models/usuariosModel.js:10-11`:

* `cosole.log(error);`

Hay un typo: `cosole` en lugar de `console`.

Si la query falla, además de fallar la autenticación, se enmascara el error real.

### 13) Eliminación por GET

En `back/routes/admin/novedades.js:68-76` se elimina por `GET /eliminar/:id`.

Eso no es deseable:

* semánticamente incorrecto;
* más expuesto a acciones accidentales;
* sin CSRF, peor.

---

## Hallazgos de frontend adicionales

### 14) Prop contract inconsistente en formulario

En `src/components/contactForm.js`, el componente espera:

* `postUr`

En `src/app/page.js` una rama del conflicto le pasa:

* `postUrl`

Y otra:

* `postUr`

Aunque resolvieras el merge “a mano” sin cuidado, es muy fácil dejar el formulario roto.

### 15) Imagen rota por case mismatch probable

En `src/app/layout.js:18` se usa:

* `/imagenes/CodeWork-logo.png`

Pero el archivo real está en:

* `public/Imagenes/CodeWork-logo.png`

En Linux eso falla.
Otra vez aparece el patrón Windows/macOS vs hosting Unix.

### 16) Código duplicado/inconsistente en novedades

En `src/app/novedades/page.js`:

* se pasa `body`, pero `NovedadItem` no lo usa;
* `imagen` se pasa dos veces;
* el componente `NovedadItem` mismo está contaminado por conflicto de merge.

No es grave por sí solo, pero confirma que el frontend quedó en estado intermedio.

### 17) Uso inconsistente de metadatos

En App Router se usa mejor `metadata`, pero la home además usa `next/head`.

No es el mayor problema, pero muestra mezcla de estilos y versiones.

---

## Higiene de repositorio y operación

### 18) `.env` está siendo trackeado

Aunque `.gitignore` ignora `.env*`, el archivo `back/.env` está efectivamente versionado en Git dentro del repo entregado.

Eso es serio.

Implica:

* exposición de secretos en el historial;
* necesidad de **rotar credenciales**;
* necesidad de limpiar la práctica de configuración.

### 19) No hay pipeline básico de calidad

No encontré scripts de:

* test
* lint
* type-check
* format
* CI de build

Para un proyecto que ya atraviesa conflictos de integración, esto explica por qué el estado roto llegó tan lejos sin bloqueo previo.

### 20) Los README no describen el sistema real

Los README son plantillas de `create-next-app`, no documentación útil del servicio.
Eso afecta onboarding, mantenimiento y traspaso.

---

## Qué sí parece relativamente rescatable

No todo está mal.

Hay una base rescatable:

* el backend **carga** a nivel módulo;
* la separación conceptual frontend/backend existe;
* el modelo `novedadesModel` es simple;
* la integración SMTP/Cloudinary/MySQL es directa y entendible;
* para un proyecto pequeño, la complejidad de negocio no parece alta.

El problema no es que el sistema sea conceptualmente intratable.
El problema es que está **mal cerrado y mal consolidado**.

---

## Diagnóstico de fondo

Mi lectura técnica es esta:

### Raíz del problema

No parece haber una disciplina clara de:

* fuente canónica del frontend,
* contratos entre capas,
* migraciones de esquema,
* control de conflictos Git,
* validación automática previa a merge/deploy.

### Síntoma dominante

El repositorio refleja una secuencia de cambios rápidos y correctivos, especialmente vinculados a:

* imports case-sensitive,
* reorganización de carpeta `front`,
* ajustes visuales,
* despliegue.

### Traducción arquitectónica

No hay todavía una arquitectura establecida como sistema; hay **una acumulación de soluciones parciales**.

---

## Priorización por severidad

### Crítico

* conflictos de merge sin resolver;
* dualidad raíz vs `/front`;
* desalineación de esquemas SQL/código;
* `.env` trackeado;
* case-sensitivity roto.

### Alto

* MD5 para contraseñas;
* sesiones con secret hardcodeado y store en memoria;
* async errors sin estrategia;
* CORS abierto;
* login/admin con inconsistencias de sesión.

### Medio

* props inconsistentes;
* duplicación de código;
* README plantillas;
* eliminación por GET;
* falta de pipeline de calidad.

---

## Dictamen técnico

**El servicio no está en un estado sano de mantenimiento.**
No lo pondría en producción seria sin una fase corta de estabilización estructural.

