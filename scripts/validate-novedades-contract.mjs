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

const apiConfigSource = readFileSync(path.join(root, "src/lib/apiConfig.js"), "utf8");
const apiConfigModule = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(apiConfigSource)}`
);
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function withApiBaseUrl(value, fn) {
  if (value === undefined) {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BASE_URL = value;
  }

  try {
    fn();
  } finally {
    if (originalApiBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    }
  }
}

function assertApiBaseUrl(value, expectedBaseUrl) {
  withApiBaseUrl(value, () => {
    assert(
      apiConfigModule.getApiBaseUrl() === expectedBaseUrl,
      `getApiBaseUrl must normalize ${String(value)} to ${expectedBaseUrl}`
    );
    assert(
      apiConfigModule.buildApiUrl("/api/novedades") === `${expectedBaseUrl}/api/novedades`,
      `buildApiUrl must build novedades URL from ${expectedBaseUrl}`
    );
  });
}

function assertInvalidApiBaseUrl(value) {
  withApiBaseUrl(value, () => {
    assertThrows(
      () => apiConfigModule.getApiBaseUrl(),
      "NEXT_PUBLIC_API_BASE_URL must be configured with an absolute HTTP/HTTPS URL"
    );
    assertThrows(
      () => apiConfigModule.buildApiUrl("/api/novedades"),
      "NEXT_PUBLIC_API_BASE_URL must be configured with an absolute HTTP/HTTPS URL"
    );
  });
}

const checks = [
  {
    file: "database/schema.sql",
    required: ["titulo", "descripcion", "fecha_publicacion", "estado", "img_id", "link"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/models/novedadesModel.js",
    required: [
      "getPublicNovedades",
      "WHERE estado = 1",
      "ORDER BY fecha_publicacion DESC, id DESC",
      "descripcion",
      "fecha_publicacion",
      "estado",
      "img_id",
      "link",
    ],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/lib/novedadesContract.js",
    required: [
      "CANONICAL_NOVEDAD_FIELDS",
      "buildNovedadInput",
      "normalizeNovedadRow",
      "serializePublicNovedad",
    ],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "back/services/novedadesService.js",
    required: [
      "getPublicNovedades",
      "img_id",
      "serializePublicNovedad",
      "buildNovedadImageUrl",
      "listPublicNovedades",
    ],
    forbidden: ["subtitulo", "cuerpo", "estado === 1"],
  },
  {
    file: "back/controllers/apiController.js",
    required: ["listPublicNovedades", "getNovedades"],
    forbidden: ["subtitulo", "cuerpo"],
  },
  {
    file: "src/app/novedades/page.js",
    required: [
      "buildApiUrl",
      "response.ok",
      "descripcion",
      "fecha_publicacion",
      "imagen",
      "link",
      "No pudimos cargar las novedades en este momento",
    ],
    forbidden: ["cuerpo", "subtitulo", "process.env.NEXT_PUBLIC_API_BASE_URL"],
  },
  {
    file: "src/lib/apiConfig.js",
    required: [
      "getApiBaseUrl",
      "buildApiUrl",
      "process.env.NEXT_PUBLIC_API_BASE_URL",
      "NEXT_PUBLIC_API_BASE_URL must be configured with an absolute HTTP/HTTPS URL",
      "new URL",
    ],
    forbidden: [],
  },
  {
    file: "src/components/NovedadItem.js",
    required: ["formatPublishDate", 'split("-")', "${day}/${month}/${year}"],
    forbidden: ["new Date(publishDate)", "estado", "img_id"],
  },
  {
    file: "src/components/ContactForm.js",
    required: ["postUrl", "buildApiUrl", "/api/contacto"],
    forbidden: ["process.env.NEXT_PUBLIC_API_BASE_URL"],
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

const frontendApiFiles = [
  "src/app/novedades/page.js",
  "src/app/contacto/page.js",
  "src/app/page.js",
  "src/components/ContactForm.js",
];

for (const file of frontendApiFiles) {
  const content = readFileSync(path.join(root, file), "utf8");

  assert(
    !content.includes("process.env.NEXT_PUBLIC_API_BASE_URL"),
    `${file} must use src/lib/apiConfig.js instead of reading NEXT_PUBLIC_API_BASE_URL directly`
  );
}

const contactFormContent = readFileSync(
  path.join(root, "src/components/ContactForm.js"),
  "utf8"
);

assert(
  !/\bpostUr\b/.test(contactFormContent),
  "ContactForm must use postUrl instead of the legacy postUr typo"
);

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

const serializedNovedad = serializePublicNovedad(
  normalizedRow,
  "https://cdn.example.com/img"
);
assert(
  serializedNovedad.imagen === "https://cdn.example.com/img",
  "serializePublicNovedad must expose imagen"
);
assert(
  serializedNovedad.descripcion === "Descripcion",
  "serializePublicNovedad must expose descripcion"
);
assert(
  !Object.hasOwn(serializedNovedad, "img_id"),
  "serializePublicNovedad must not expose img_id"
);
assert(
  !Object.hasOwn(serializedNovedad, "estado"),
  "serializePublicNovedad must not expose estado"
);

function formatCanonicalDateForDisplay(value) {
  if (typeof value !== "string") {
    return "";
  }

  const parts = value.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);

  if (
    !Number.isInteger(yearNumber) ||
    !Number.isInteger(monthNumber) ||
    !Number.isInteger(dayNumber) ||
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2 ||
    monthNumber < 1 ||
    monthNumber > 12 ||
    dayNumber < 1 ||
    dayNumber > 31
  ) {
    return "";
  }

  return `${day}/${month}/${year}`;
}

assert(
  formatCanonicalDateForDisplay("2026-04-23") === "23/04/2026",
  "Public novedades date formatting must preserve the canonical calendar day"
);
assert(
  formatCanonicalDateForDisplay(null) === "",
  "Public novedades date formatting must tolerate null values"
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

assertApiBaseUrl("http://localhost:3001", "http://localhost:3001");
assertApiBaseUrl("http://localhost:3001/", "http://localhost:3001");

assertInvalidApiBaseUrl(undefined);
assertInvalidApiBaseUrl("");
assertInvalidApiBaseUrl("undefined");
assertInvalidApiBaseUrl("null");
assertInvalidApiBaseUrl("/api");
assertInvalidApiBaseUrl("ftp://localhost:3001");

console.log("Novedades contract validation passed.");
