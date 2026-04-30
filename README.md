# CodeWorkDigital

## Frontend canonico

La unica fuente canonica del frontend es la raiz del repositorio.

Usar estas rutas como frontend activo:

- `src/`
- `public/`
- `package.json`
- `next.config.mjs`

## Instalacion

Desde la raiz del repositorio:

```bash
npm install
```

Para el backend:

```bash
cd back
npm install
```

## Ejecucion del frontend correcto

Desde la raiz del repositorio:

```bash
npm run dev
```

Frontend disponible en `http://localhost:3000`.

## Setup local sin secretos versionados

- El frontend debe configurarse creando `.env.local` en la raiz a partir de `.env.example`.
- `NEXT_PUBLIC_API_BASE_URL` es configuracion publica del frontend, no un secreto. Por el prefijo `NEXT_PUBLIC_`, Next.js puede exponerla al navegador.
- El backend debe configurarse creando `back/.env` a partir de `back/.env.example`.
- `.env.example` y `back/.env.example` son las plantillas versionadas.
- `.env.local` y `back/.env` son locales y no deben commitearse.

Flujo recomendado para el frontend:

```bash
copy .env.example .env.local
```

El valor local esperado para desarrollo es:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Flujo recomendado para el backend:

```bash
cd back
copy .env.example .env
```

Luego completar localmente los valores sensibles.

## Base de datos

La fuente SQL canonica del proyecto vive en `database/`.

- `database/schema.sql`: schema canonico del runtime real (`usuarios` + `novedades`)
- `database/seed.sql`: bootstrap canonico inicial (`admin` + datos iniciales de `novedades`)

Uso recomendado:

1. crear o seleccionar la base configurada en `MYSQL_DB_NAME`
2. ejecutar `database/schema.sql`
3. ejecutar `database/seed.sql`

Los archivos SQL historicos fuera de `database/` ya no forman parte de la fuente operativa activa.

Bootstrap admin inicial:

- usuario: `admin`
- password inicial: `admin1234`

Ese usuario existe solo para bootstrap del entorno. Debe cambiarse la credencial luego del primer ingreso al admin.

Comportamiento del seed:

- `database/seed.sql` es idempotente para el usuario bootstrap `admin`
- `database/seed.sql` es idempotente para las novedades canonicas incluidas
- el criterio usado para evitar duplicacion de novedades del seed es `titulo + fecha_publicacion`

## Validaciones minimas

Se agregaron compuertas basicas para el frontend canonico:

- `npm run validate:structure`: verifica que la raiz siga siendo la unica fuente canonica del frontend.
- `npm run validate:database-bootstrap`: verifica que la fuente SQL canonica cubra el runtime real (`usuarios` + `novedades`), que el hash bootstrap admin sea compatible con el backend y que el seed canonico sea idempotente.
- `npm run validate:novedades-contract`: verifica el contrato canonico de `novedades` con checks de comportamiento sobre normalizacion y serializacion, ademas de revisar referencias legadas.
- `npm run validate:repo-hygiene`: verifica que no haya secretos ni artefactos impropios versionados.
- `npm run test:backend`: corre tests minimos utiles del backend con el runner nativo de Node.
- `npm run validate:backend`: carga la app backend y ejecuta esos tests.
- `npm run validate`: ejecuta la validacion estructural, la higiene operativa, valida el bootstrap SQL, valida el contrato de `novedades`, valida el backend y luego compila el frontend raiz.
- `npm run build`: corre primero la validacion estructural y despues compila Next.js.

Tests backend cubiertos hoy:

- contrato canonico de `novedades`
- serializacion publica de novedades
- validacion y configuracion del formulario de contacto
- bootstrap SQL de admin y novedades
- smoke test de carga y respuestas base del backend

## Contrato canonico de novedades

La forma canonica de `novedad` en el sistema es:

- `id`
- `titulo`
- `descripcion`
- `fecha_publicacion`
- `estado`
- `img_id` opcional
- `link` opcional

La API publica de novedades devuelve solo novedades activas (`estado = 1`) y expone un DTO publico reducido:

- `id`
- `titulo`
- `descripcion`
- `fecha_publicacion`
- `link`
- `imagen`

`imagen` es un campo derivado desde `img_id`. El DTO publico no expone `img_id` ni `estado`; esos campos quedan reservados para el contrato interno/admin. Los campos legados `subtitulo` y `cuerpo` quedan fuera del contrato activo.

## Backend y seguridad

El backend toma configuracion sensible desde variables de entorno. Para replicar la configuracion base usar `back/.env.example`.

Variables relevantes para hardening:

- `SESSION_SECRET`: secreto de sesion obligatorio en produccion.
- `SESSION_COOKIE_NAME`: nombre de la cookie de sesion.
- `SESSION_MAX_AGE_MS`: duracion de la sesion en milisegundos.
- `TRUST_PROXY`: usar `true` si el backend corre detras de proxy y se necesita cookie `secure`.
- `CORS_ALLOWED_ORIGINS`: lista separada por comas de origenes permitidos para `/api`.
- `CONTACT_FORM_RECIPIENT`: destinatario configurado para los mensajes del formulario de contacto.

Autenticacion:

- el backend ya no usa MD5 como mecanismo principal;
- acepta temporalmente hashes legacy MD5 solo para compatibilidad de login;
- cuando un usuario con hash legacy inicia sesion correctamente, su password se migra automaticamente a un hash seguro basado en `scrypt`.

Limitacion actual:

- la sesion sigue usando `MemoryStore` de `express-session`;
- se endurecio la configuracion, pero no se incorporo un store persistente en este incremento para evitar complejidad operativa adicional.

## Organizacion pragmatica del backend

El backend sigue una separacion liviana:

- `routes/`: define endpoints y delega.
- `controllers/`: resuelve flujo HTTP y renderizado/respuesta.
- `services/`: concentra logica de negocio y orquestacion.
- `lib/`: helpers puros, contratos, integraciones y utilidades compartidas.

La idea es mantener rutas delgadas y encapsular integraciones externas o validaciones repetidas fuera de Express.

## Politica minima de versionado

Debe vivir en el repo:

- codigo fuente
- configuracion plantilla
- `package.json`
- `package-lock.json`
- scripts de validacion
- documentacion

No debe vivir en el repo:

- secretos reales
- `back/.env`
- `node_modules`
- `.next`
- logs
- metadatos locales de IDE

Accion manual posterior recomendada:

- rotar cualquier secreto previamente expuesto en `back/.env`
- evaluar limpieza del historial Git si esos secretos ya quedaron publicados en commits anteriores
