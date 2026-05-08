import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializePublicNovedad,
} = require(path.join(root, "back/lib/novedadesContract.js"));

const forbiddenPublicNovedadesFields = ["descripcion", "fecha_publicacion", "estado", "img_id", "link"];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(content, token, file) {
  assert(content.includes(token), `${file} is missing required token "${token}"`);
}

function assertExcludes(content, token, file) {
  assert(!content.includes(token), `${file} still references forbidden token "${token}"`);
}

const legacyFiles = [
  "database/schema.sql",
  "database/seed.sql",
  "back/novedades_schema.sql",
  "back/services/novedadesService.js",
  "back/views/admin/agregar.hbs",
  "back/views/admin/modificar.hbs",
  "back/views/admin/novedades.hbs",
];

for (const file of legacyFiles) {
  const content = read(file);

  assert(!/\bname="link"/.test(content), `${file} must not submit link`);
  assert(!/\blink\b/.test(content.replace(/<link[^>]*>/g, "")), `${file} must not require link`);
}

for (const file of [
  "database/schema.sql",
  "database/seed.sql",
  "back/novedades_schema.sql",
  "back/lib/novedadesContract.js",
  "back/views/admin/agregar.hbs",
  "back/views/admin/modificar.hbs",
]) {
  const content = read(file);

  ["titulo", "subtitulo", "cuerpo"].forEach((token) =>
    assertIncludes(content, token, file)
  );
}

const model = read("back/models/novedadesModel.js");
assertIncludes(
  model,
  "SELECT id, titulo, descripcion, fecha_publicacion, estado",
  "back/models/novedadesModel.js"
);
assertIncludes(model, "FROM novedades", "back/models/novedadesModel.js");
assert(!/WHERE\s+estado/i.test(model), "novedades model must not filter by estado");
assert(!/\bSELECT\s+id,\s*titulo,\s*subtitulo,\s*cuerpo/i.test(model), "novedades model must not query missing DB columns");

const publicPage = read("src/app/novedades/page.js");
["item.titulo", "item.subtitulo", "item.cuerpo"].forEach((token) =>
  assertIncludes(publicPage, token, "src/app/novedades/page.js")
);
forbiddenPublicNovedadesFields.forEach((token) =>
  assertExcludes(publicPage, token, "src/app/novedades/page.js")
);

const itemComponent = read("src/components/NovedadItem.js");
["title", "subtitle", "body"].forEach((token) =>
  assertIncludes(itemComponent, token, "src/components/NovedadItem.js")
);
["descripcion", "fecha_publicacion", "estado", "img_id"].forEach((token) =>
  assertExcludes(itemComponent, token, "src/components/NovedadItem.js")
);

assert(
  Array.isArray(CANONICAL_NOVEDAD_FIELDS) &&
    CANONICAL_NOVEDAD_FIELDS.join(",") === "id,titulo,subtitulo,cuerpo",
  "Canonical novedad fields must remain legacy and ordered"
);

const normalizedInput = buildNovedadInput({
  titulo: "  Titulo legacy  ",
  subtitulo: "  Subtitulo legacy  ",
  cuerpo: "  Cuerpo legacy  ",
});

assert(normalizedInput.titulo === "Titulo legacy", "buildNovedadInput must trim titulo");
assert(
  normalizedInput.subtitulo === "Subtitulo legacy",
  "buildNovedadInput must trim subtitulo"
);
assert(normalizedInput.cuerpo === "Cuerpo legacy", "buildNovedadInput must trim cuerpo");

const normalizedRow = normalizeNovedadRow({
  id: 10,
  titulo: "Titulo",
  descripcion: "Descripcion",
  fecha_publicacion: "2026-04-23",
  estado: 1,
});

assert(normalizedRow.id === 10, "normalizeNovedadRow must preserve id");
assert(normalizedRow.subtitulo === "2026-04-23", "normalizeNovedadRow must map fecha_publicacion to subtitulo");
assert(normalizedRow.cuerpo === "Descripcion", "normalizeNovedadRow must map descripcion to cuerpo");

const serializedNovedad = serializePublicNovedad(normalizedRow);
assert(
  Object.keys(serializedNovedad).join(",") === "id,titulo,subtitulo,cuerpo",
  "serializePublicNovedad must expose only legacy public fields"
);

console.log("Novedades legacy contract validation passed.");
