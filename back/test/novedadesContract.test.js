var test = require("node:test");
var assert = require("node:assert/strict");
var {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializePublicNovedad,
} = require("../lib/novedadesContract");

test("CANONICAL_NOVEDAD_FIELDS mantiene el contrato legacy esperado", function () {
  assert.deepEqual(CANONICAL_NOVEDAD_FIELDS, [
    "id",
    "titulo",
    "subtitulo",
    "cuerpo",
  ]);
});

test("buildNovedadInput normaliza campos legacy", function () {
  var novedad = buildNovedadInput({
    titulo: "  Lanzamiento  ",
    subtitulo: "  Nueva etapa  ",
    cuerpo: "  Cuerpo de la novedad  ",
  });

  assert.deepEqual(novedad, {
    titulo: "Lanzamiento",
    subtitulo: "Nueva etapa",
    cuerpo: "Cuerpo de la novedad",
  });
});

test("buildNovedadInput rechaza payloads legacy incompletos", function () {
  assert.throws(
    function () {
      buildNovedadInput({
        titulo: "Sin cuerpo",
        subtitulo: "Subtitulo",
        cuerpo: "",
      });
    },
    /required legacy fields/
  );
});

test("normalizeNovedadRow normaliza filas de DB real al DTO publico", function () {
  var novedad = normalizeNovedadRow({
    id: 22,
    titulo: "Titulo",
    descripcion: "Descripcion",
    fecha_publicacion: new Date("2026-04-23T00:00:00.000Z"),
    estado: 1,
  });

  assert.deepEqual(novedad, {
    id: 22,
    titulo: "Titulo",
    subtitulo: "2026-04-23",
    cuerpo: "Descripcion",
  });
});

test("serializePublicNovedad expone el DTO publico legacy", function () {
  var serialized = serializePublicNovedad({
    id: 3,
    titulo: "Titulo",
    subtitulo: "Subtitulo",
    cuerpo: "Cuerpo",
  });

  assert.deepEqual(serialized, {
    id: 3,
    titulo: "Titulo",
    subtitulo: "Subtitulo",
    cuerpo: "Cuerpo",
  });
});
