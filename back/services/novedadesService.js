var createError = require("http-errors");
var novedadesModel = require("../models/novedadesModel");
var {
  buildNovedadInput,
  serializePublicNovedad,
} = require("../lib/novedadesContract");
var { buildNovedadImageUrl } = require("../lib/cloudinaryClient");

async function listNovedades() {
  return novedadesModel.getNovedades();
}

async function listPublicNovedades() {
  var novedades = await novedadesModel.getPublicNovedades();

  return novedades.map((novedad) =>
    serializePublicNovedad(novedad, buildNovedadImageUrl(novedad.img_id))
  );
}

async function getNovedadById(id) {
  return novedadesModel.getNovedadById(id);
}

async function getNovedadByIdOrThrow(id) {
  var novedad = await novedadesModel.getNovedadById(id);

  if (!novedad) {
    throw createError(404, "Novedad no encontrada");
  }

  return novedad;
}

async function createNovedad(payload) {
  var novedad = buildNovedadInput(payload);
  await novedadesModel.insertNovedad(novedad);
  return novedad;
}

async function updateNovedad(id, payload) {
  await getNovedadByIdOrThrow(id);

  var novedad = buildNovedadInput(payload);
  await novedadesModel.modificarNovedadById(novedad, id);
  return novedad;
}

async function deleteNovedad(id) {
  await getNovedadByIdOrThrow(id);
  await novedadesModel.deleteNovedadesById(id);
}

module.exports = {
  listNovedades,
  listPublicNovedades,
  getNovedadById,
  getNovedadByIdOrThrow,
  createNovedad,
  updateNovedad,
  deleteNovedad,
};
