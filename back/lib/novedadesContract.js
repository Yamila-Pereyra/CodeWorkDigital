const CANONICAL_NOVEDAD_FIELDS = [
  "id",
  "titulo",
  "descripcion",
  "fecha_publicacion",
  "estado",
  "img_id",
  "link",
];

function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeRequiredString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeEstado(value) {
  if (value === 1 || value === "1" || value === true) {
    return 1;
  }

  if (value === 0 || value === "0" || value === false) {
    return 0;
  }

  return null;
}

function normalizeFechaPublicacion(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function validateNovedadShape(novedad) {
  if (!novedad || typeof novedad !== "object") {
    throw new Error("Invalid novedad payload");
  }

  if (!novedad.titulo || !novedad.descripcion || !novedad.fecha_publicacion) {
    throw new Error("Novedad is missing required canonical fields");
  }

  if (novedad.estado !== 0 && novedad.estado !== 1) {
    throw new Error("Novedad estado must be 0 or 1");
  }
}

function normalizeNovedadRow(row) {
  const novedad = {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    fecha_publicacion: normalizeFechaPublicacion(row.fecha_publicacion),
    estado: normalizeEstado(row.estado),
    img_id: normalizeOptionalString(row.img_id),
    link: normalizeOptionalString(row.link),
  };

  validateNovedadShape(novedad);
  return novedad;
}

function buildNovedadInput(body) {
  const novedad = {
    titulo: normalizeRequiredString(body.titulo),
    descripcion: normalizeRequiredString(body.descripcion),
    fecha_publicacion: normalizeFechaPublicacion(body.fecha_publicacion),
    estado: normalizeEstado(body.estado),
    img_id: normalizeOptionalString(body.img_id),
    link: normalizeOptionalString(body.link),
  };

  validateNovedadShape(novedad);
  return novedad;
}

function serializePublicNovedad(novedad, imagen) {
  return {
    id: novedad.id,
    titulo: novedad.titulo,
    descripcion: novedad.descripcion,
    fecha_publicacion: novedad.fecha_publicacion,
    link: novedad.link || null,
    imagen: imagen || null,
  };
}

module.exports = {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializePublicNovedad,
};
