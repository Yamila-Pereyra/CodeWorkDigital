# CodeWorkDigital

## Frontend canonico

La unica fuente canonica del frontend es la raiz del repositorio.

Usar estas rutas como frontend activo:

- `src/`
- `public/`
- `package.json`
- `next.config.mjs`

La carpeta `front/` queda archivada como frontend legado y no debe usarse para editar, ejecutar ni desplegar.

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

- El frontend no requiere archivo `.env` en la raiz para el estado actual del repo.
- El backend debe configurarse creando `back/.env` a partir de `back/.env.example`.
- `back/.env.example` es la plantilla versionada.
- `back/.env` es local y no debe commitearse.

Flujo recomendado:

```bash
cd back
copy .env.example .env
```

Luego completar localmente los valores sensibles.

## Validaciones minimas

Se agregaron compuertas basicas para el frontend canonico:

- `npm run validate:structure`: verifica que la raiz siga siendo la fuente canonica y que `front/` permanezca archivado.
- `npm run validate:novedades-contract`: verifica el contrato canonico de `novedades` con checks de comportamiento sobre normalizacion y serializacion, ademas de revisar referencias legadas.
- `npm run validate:repo-hygiene`: verifica que no haya secretos ni artefactos impropios versionados.
- `npm run test:backend`: corre tests minimos utiles del backend con el runner nativo de Node.
- `npm run validate:backend`: carga la app backend y ejecuta esos tests.
- `npm run validate`: ejecuta la validacion estructural, la higiene operativa, valida el contrato de `novedades`, valida el backend y luego compila el frontend raiz.
- `npm run build`: corre primero la validacion estructural y despues compila Next.js.

Tests backend cubiertos hoy:

- contrato canonico de `novedades`
- serializacion publica de novedades
- validacion y configuracion del formulario de contacto
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

La API publica tambien `imagen` como campo derivado desde `img_id`. Los campos legados `subtitulo` y `cuerpo` quedan fuera del contrato activo.

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

## Frontend legado

`front/` se conserva solo como resguardo historico. No debe:

- recibir cambios nuevos,
- usarse para instalar dependencias activas,
- usarse para `dev`, `build` o `start`,
- tomarse como referencia de despliegue.

Si hace falta revisar material previo, hacerlo solo como consulta y mover cualquier trabajo nuevo al frontend de la raiz.
