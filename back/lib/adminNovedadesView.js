function buildAdminViewNovedad(novedad) {
  return novedad || {};
}

function buildNovedadesListViewModel(usuario, novedades, error, message) {
  return {
    layout: "admin/layout",
    usuario,
    novedades,
    error: Boolean(error),
    message,
  };
}

function buildNovedadFormViewModel(novedad, error, message) {
  return {
    layout: "admin/layout",
    novedad: buildAdminViewNovedad(novedad),
    error: Boolean(error),
    message,
  };
}

module.exports = {
  buildAdminViewNovedad,
  buildNovedadesListViewModel,
  buildNovedadFormViewModel,
};
