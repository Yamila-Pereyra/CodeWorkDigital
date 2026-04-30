var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("getPublicNovedades consulta solo novedades activas con el orden publico esperado", async function () {
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
            img_id: "news/cover",
            link: "https://example.com",
          },
        ];
      },
    },
  });

  var novedades = await novedadesModel.getPublicNovedades();

  assert.match(executedQuery, /WHERE\s+estado\s*=\s*1/i);
  assert.match(executedQuery, /ORDER\s+BY\s+fecha_publicacion\s+DESC,\s+id\s+DESC/i);
  assert.equal(novedades.length, 1);
  assert.equal(novedades[0].titulo, "Titulo publico");
  assert.equal(novedades[0].estado, 1);
});
