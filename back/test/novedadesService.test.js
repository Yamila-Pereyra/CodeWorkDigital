var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("listPublicNovedades serializa imagen pública desde img_id", async function () {
  var modelCalls = 0;
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      getPublicNovedades: async function () {
        modelCalls += 1;

        return [
          {
            id: 1,
            titulo: "Titulo",
            descripcion: "Descripcion",
            fecha_publicacion: "2026-04-23",
            estado: 1,
            img_id: "news/cover",
            link: "https://example.com",
          },
        ];
      },
    },
    "../lib/cloudinaryClient": {
      buildNovedadImageUrl: function (imgId) {
        return "https://cdn.example.com/" + imgId;
      },
    },
  });

  var novedades = await novedadesService.listPublicNovedades();

  assert.equal(modelCalls, 1);
  assert.equal(novedades.length, 1);
  assert.equal(novedades[0].imagen, "https://cdn.example.com/news/cover");
  assert.equal(novedades[0].descripcion, "Descripcion");
  assert.equal(novedades[0].titulo, "Titulo");
  assert.equal(Object.hasOwn(novedades[0], "img_id"), false);
  assert.equal(Object.hasOwn(novedades[0], "estado"), false);
});

test("getNovedadByIdOrThrow responde 404 cuando la novedad no existe", async function () {
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      getNovedadById: async function () {
        return null;
      },
    },
    "../lib/cloudinaryClient": {
      buildNovedadImageUrl: function () {
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

test("createNovedad normaliza antes de persistir", async function () {
  var insertedPayload = null;
  var novedadesService = loadModuleWithMocks("services/novedadesService.js", {
    "../models/novedadesModel": {
      insertNovedad: async function (payload) {
        insertedPayload = payload;
      },
    },
    "../lib/cloudinaryClient": {
      buildNovedadImageUrl: function () {
        return null;
      },
    },
  });

  await novedadesService.createNovedad({
    titulo: "  Titulo  ",
    descripcion: "  Descripcion  ",
    fecha_publicacion: "2026-04-23T00:00:00.000Z",
    estado: "1",
    img_id: "",
    link: "  ",
  });

  assert.deepEqual(insertedPayload, {
    titulo: "Titulo",
    descripcion: "Descripcion",
    fecha_publicacion: "2026-04-23",
    estado: 1,
    img_id: null,
    link: null,
  });
});
