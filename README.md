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
- `npm run validate`: ejecuta la validacion estructural y luego el build del frontend raiz.
- `npm run build`: corre primero la validacion estructural y despues compila Next.js.

## Frontend legado

`front/` se conserva solo como resguardo historico. No debe:

- recibir cambios nuevos,
- usarse para instalar dependencias activas,
- usarse para `dev`, `build` o `start`,
- tomarse como referencia de despliegue.

Si hace falta revisar material previo, hacerlo solo como consulta y mover cualquier trabajo nuevo al frontend de la raiz.
