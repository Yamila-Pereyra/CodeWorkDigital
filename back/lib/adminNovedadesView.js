function buildAdminViewNovedad(novedad) {
  var estado = novedad && (novedad.estado === 0 || novedad.estado === "0") ? 0 : 1;

  return {
    ...novedad,
    estado,
    estado_activo: estado === 1,
    estado_inactivo: estado === 0,
  };
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
