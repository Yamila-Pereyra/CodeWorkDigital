const CANONICAL_NOVEDAD_FIELDS = [
  "id",
  "titulo",
  "subtitulo",
  "cuerpo",
];

function normalizeRequiredString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeFechaPublicacion(value) {
  if (!value) {
    return "";
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

  if (!novedad.titulo || !novedad.subtitulo || !novedad.cuerpo) {
    throw new Error("Novedad is missing required legacy fields");
  }
}

function normalizeNovedadRow(row) {
  const novedad = {
    id: row.id,
    titulo: row.titulo,
    subtitulo: normalizeFechaPublicacion(row.fecha_publicacion),
    cuerpo: row.descripcion,
  };

  validateNovedadShape(novedad);
  return novedad;
}

function buildNovedadInput(body) {
  const novedad = {
    titulo: normalizeRequiredString(body.titulo),
    subtitulo: normalizeRequiredString(body.subtitulo),
    cuerpo: normalizeRequiredString(body.cuerpo),
  };

  validateNovedadShape(novedad);
  return novedad;
}

function serializePublicNovedad(novedad) {
  return {
    id: novedad.id,
    titulo: novedad.titulo,
    subtitulo: novedad.subtitulo,
    cuerpo: novedad.cuerpo,
  };
}

module.exports = {
  CANONICAL_NOVEDAD_FIELDS,
  buildNovedadInput,
  normalizeNovedadRow,
  serializePublicNovedad,
};
