var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("listPublicNovedades devuelve el contrato publico legacy", async function () {
  var modelCalls = 0;
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      getPublicNovedades: async function () {
        modelCalls += 1;

        return [
          {
            id: 1,
            titulo: "Titulo",
            subtitulo: "Subtitulo",
            cuerpo: "Cuerpo",
          },
        ];
      },
    },
  });

  var novedades = await novedadesService.listPublicNovedades();

  assert.equal(modelCalls, 1);
  assert.deepEqual(novedades, [
    {
      id: 1,
      titulo: "Titulo",
      subtitulo: "Subtitulo",
      cuerpo: "Cuerpo",
    },
  ]);
});

test("getNovedadByIdOrThrow responde 404 cuando la novedad no existe", async function () {
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      getNovedadById: async function () {
        return null;
      },
    },
  });

  await assert.rejects(
    function () {
      return novedadesService.getNovedadByIdOrThrow(999);
    },
    function (error) {
      assert.equal(error.status, 404);
      assert.match(error.message, /Novedad no encontrada/);
      return true;
    }
  );
});

test("createNovedad normaliza el payload legacy antes de persistir", async function () {
  var insertedPayload = null;
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      insertNovedad: async function (payload) {
        insertedPayload = payload;
      },
    },
  });

  await novedadesService.createNovedad({
    titulo: "  Titulo  ",
    subtitulo: "  Subtitulo  ",
    cuerpo: "  Cuerpo  ",
  });

  assert.deepEqual(insertedPayload, {
    titulo: "Titulo",
    subtitulo: "Subtitulo",
    cuerpo: "Cuerpo",
  });
});
