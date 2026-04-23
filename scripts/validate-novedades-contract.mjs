import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "back/novedades_schema.sql",
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
    required: ["descripcion", "fecha_publicacion", "estado", "img_id", "link"],
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

console.log("Novedades contract validation passed.");
