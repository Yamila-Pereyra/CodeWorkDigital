var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("getPublicNovedades consulta la tabla legacy sin columnas nuevas", async function () {
  var executedQuery = null;
  var novedadesModel = loadModuleWithMocks("models/novedadesModel.js", {
    "./bd": {
      query: async function (query) {
        executedQuery = query;

        return [
          {
            id: 1,
            titulo: "Titulo publico",
            subtitulo: "Subtitulo publico",
            cuerpo: "Cuerpo publico",
          },
        ];
      },
    },
  });

  var novedades = await novedadesModel.getPublicNovedades();

  assert.match(executedQuery, /SELECT\s+id,\s*titulo,\s*subtitulo,\s*cuerpo/i);
  assert.match(executedQuery, /FROM\s+novedades/i);
  assert.doesNotMatch(executedQuery, /descripcion|fecha_publicacion|estado|img_id|link/i);
  assert.equal(novedades.length, 1);
  assert.deepEqual(novedades[0], {
    id: 1,
    titulo: "Titulo publico",
    subtitulo: "Subtitulo publico",
    cuerpo: "Cuerpo publico",
  });
});
