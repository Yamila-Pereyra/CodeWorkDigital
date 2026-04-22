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

## Ejecucion del frontend correcto

Desde la raiz del repositorio:

```bash
npm run dev
```

Frontend disponible en `http://localhost:3000`.

## Validaciones minimas

Se agregaron compuertas basicas para el frontend canonico:

- `npm run validate:structure`: verifica que la raiz siga siendo la fuente canonica y que `front/` permanezca archivado.
- `npm run validate:novedades-contract`: verifica que el runtime use el contrato canonico de `novedades` y no referencias legadas.
- `npm run validate`: ejecuta la validacion estructural, valida el contrato de `novedades` y luego compila el frontend raiz.
- `npm run build`: corre primero la validacion estructural y despues compila Next.js.

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

Autenticacion:

- el backend ya no usa MD5 como mecanismo principal;
- acepta temporalmente hashes legacy MD5 solo para compatibilidad de login;
- cuando un usuario con hash legacy inicia sesion correctamente, su password se migra automaticamente a un hash seguro basado en `scrypt`.

Limitacion actual:

- la sesion sigue usando `MemoryStore` de `express-session`;
- se endurecio la configuracion, pero no se incorporo un store persistente en este incremento para evitar complejidad operativa adicional.

## Frontend legado

`front/` se conserva solo como resguardo historico. No debe:

- recibir cambios nuevos,
- usarse para instalar dependencias activas,
- usarse para `dev`, `build` o `start`,
- tomarse como referencia de despliegue.

Si hace falta revisar material previo, hacerlo solo como consulta y mover cualquier trabajo nuevo al frontend de la raiz.
