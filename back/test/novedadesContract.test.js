var test = require("node:test");
var assert = require("node:assert/strict");
var {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializePublicNovedad,
} = require("../lib/novedadesContract");

test("CANONICAL_NOVEDAD_FIELDS mantiene el contrato esperado", function () {
  assert.deepEqual(CANONICAL_NOVEDAD_FIELDS, [
    "id",
    "titulo",
    "descripcion",
    "fecha_publicacion",
    "estado",
    "img_id",
    "link",
  ]);
});

test("buildNovedadInput normaliza campos canónicos", function () {
  var novedad = buildNovedadInput({
    titulo: "  Lanzamiento  ",
    descripcion: "  Nueva descripcion  ",
    fecha_publicacion: "2026-04-23T10:30:00.000Z",
    estado: "0",
    img_id: "  cloudinary/id  ",
    link: "  https://example.com  ",
  });

  assert.deepEqual(novedad, {
    titulo: "Lanzamiento",
    descripcion: "Nueva descripcion",
    fecha_publicacion: "2026-04-23",
    estado: 0,
    img_id: "cloudinary/id",
    link: "https://example.com",
  });
});

test("buildNovedadInput rechaza payloads incompletos", function () {
  assert.throws(
    function () {
      buildNovedadInput({
        titulo: "Sin descripcion",
        descripcion: "",
        fecha_publicacion: "2026-04-23",
        estado: 1,
      });
    },
    /required canonical fields/
  );
});

test("normalizeNovedadRow normaliza filas de DB y campos opcionales vacios", function () {
  var novedad = normalizeNovedadRow({
    id: 22,
    titulo: "Titulo",
    descripcion: "Descripcion",
    fecha_publicacion: new Date("2026-04-23T00:00:00.000Z"),
    estado: true,
    img_id: " ",
    link: "",
  });

  assert.deepEqual(novedad, {
    id: 22,
    titulo: "Titulo",
    descripcion: "Descripcion",
    fecha_publicacion: "2026-04-23",
    estado: 1,
    img_id: null,
    link: null,
  });
});

test("serializePublicNovedad expone solo el DTO publico", function () {
  var serialized = serializePublicNovedad(
    {
      id: 3,
      titulo: "Titulo",
      descripcion: "Descripcion",
      fecha_publicacion: "2026-04-23",
      estado: 1,
      img_id: null,
      link: null,
    },
    "https://cdn.example.com/image.jpg"
  );

  assert.equal(serialized.imagen, "https://cdn.example.com/image.jpg");
  assert.equal(serialized.titulo, "Titulo");
  assert.equal(serialized.descripcion, "Descripcion");
  assert.deepEqual(Object.keys(serialized), [
    "id",
    "titulo",
    "descripcion",
    "fecha_publicacion",
    "link",
    "imagen",
  ]);
  assert.equal(Object.hasOwn(serialized, "img_id"), false);
  assert.equal(Object.hasOwn(serialized, "estado"), false);
});
