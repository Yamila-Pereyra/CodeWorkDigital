var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("getPublicNovedades consulta solo columnas existentes y mapea la respuesta publica", async function () {
  var executedQuery = null;
  var novedadesModel = loadModuleWithMocks("models/novedadesModel.js", {
    "./bd": {
      query: async function (query) {
        executedQuery = query;

        return [
          {
            id: 1,
            titulo: "Titulo publico",
            descripcion: "Descripcion publica",
            fecha_publicacion: "2026-04-23",
            estado: 1,
          },
        ];
      },
    },
  });

  var novedades = await novedadesModel.getPublicNovedades();

  assert.match(
    executedQuery,
    /SELECT\s+id,\s*titulo,\s*descripcion,\s*fecha_publicacion,\s*estado/i
  );
  assert.match(executedQuery, /FROM\s+novedades/i);
  assert.doesNotMatch(executedQuery, /\bsubtitulo\b|\bcuerpo\b|img_id|link/i);
  assert.equal(novedades.length, 1);
  assert.deepEqual(novedades[0], {
    id: 1,
    titulo: "Titulo publico",
    subtitulo: "2026-04-23",
    cuerpo: "Descripcion publica",
  });
});
