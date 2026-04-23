import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializeApiNovedad,
} = require(path.join(root, "back/lib/novedadesContract.js"));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
  } catch (error) {
    if (!expectedMessage || error.message.includes(expectedMessage)) {
      return;
    }

    throw error;
  }

  throw new Error(`Expected function to throw: ${expectedMessage || "unknown error"}`);
}

const checks = [
  {
    file: "database/schema.sql",
    required: ["titulo", "descripcion", "fecha_publicacion", "estado", "img_id", "link"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/models/novedadesModel.js",
    required: ["descripcion", "fecha_publicacion", "estado", "img_id", "link"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/lib/novedadesContract.js",
    required: ["CANONICAL_NOVEDAD_FIELDS", "buildNovedadInput", "normalizeNovedadRow"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/services/novedadesService.js",
    required: ["img_id", "serializeApiNovedad", "buildNovedadImageUrl", "listPublicNovedades"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/controllers/apiController.js",
    required: ["listPublicNovedades", "getNovedades"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "src/app/novedades/page.js",
    required: ["descripcion", "fecha_publicacion", "estado", "imagen", "link"],
    forbidden: ["cuerpo", "subtitulo"],
  },
];

for (const check of checks) {
  const content = readFileSync(path.join(root, check.file), "utf8");

  for (const token of check.required) {
    if (!content.includes(token)) {
      throw new Error(`${check.file} is missing required novedades token "${token}"`);
    }
  }

  for (const token of check.forbidden) {
    if (content.includes(token)) {
      throw new Error(`${check.file} still references forbidden legacy token "${token}"`);
    }
  }
}

assert(
  Array.isArray(CANONICAL_NOVEDAD_FIELDS) &&
    CANONICAL_NOVEDAD_FIELDS.join(",") ===
      "id,titulo,descripcion,fecha_publicacion,estado,img_id,link",
  "Canonical novedad fields must remain stable and ordered"
);

const normalizedInput = buildNovedadInput({
  titulo: "  Titulo canonico  ",
  descripcion: "  Descripcion canonica  ",
  fecha_publicacion: "2026-04-23T12:34:56.000Z",
  estado: "1",
  img_id: "  portada/main  ",
  link: "  https://example.com/novedad  ",
});

assert(normalizedInput.titulo === "Titulo canonico", "buildNovedadInput must trim titulo");
assert(
  normalizedInput.descripcion === "Descripcion canonica",
  "buildNovedadInput must trim descripcion"
);
assert(
  normalizedInput.fecha_publicacion === "2026-04-23",
  "buildNovedadInput must normalize fecha_publicacion"
);
assert(normalizedInput.estado === 1, "buildNovedadInput must normalize estado");
assert(normalizedInput.img_id === "portada/main", "buildNovedadInput must trim img_id");
assert(
  normalizedInput.link === "https://example.com/novedad",
  "buildNovedadInput must trim link"
);

const normalizedRow = normalizeNovedadRow({
  id: 10,
  titulo: "Titulo",
  descripcion: "Descripcion",
  fecha_publicacion: new Date("2026-04-23T00:00:00.000Z"),
  estado: true,
  img_id: "",
  link: " ",
});

assert(normalizedRow.id === 10, "normalizeNovedadRow must preserve id");
assert(
  normalizedRow.fecha_publicacion === "2026-04-23",
  "normalizeNovedadRow must format Date values"
);
assert(normalizedRow.estado === 1, "normalizeNovedadRow must normalize boolean estado");
assert(normalizedRow.img_id === null, "normalizeNovedadRow must normalize empty img_id");
assert(normalizedRow.link === null, "normalizeNovedadRow must normalize empty link");

const serializedNovedad = serializeApiNovedad(normalizedRow, "https://cdn.example.com/img");
assert(
  serializedNovedad.imagen === "https://cdn.example.com/img",
  "serializeApiNovedad must expose imagen"
);
assert(
  serializedNovedad.descripcion === "Descripcion",
  "serializeApiNovedad must preserve canonical fields"
);

assertThrows(
  () =>
    buildNovedadInput({
      titulo: "Sin descripcion",
      descripcion: "",
      fecha_publicacion: "2026-04-23",
      estado: 1,
    }),
  "required canonical fields"
);

console.log("Novedades contract validation passed.");
