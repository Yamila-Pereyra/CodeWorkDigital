var novedadesService = require("../../services/novedadesService");
var {
  buildNovedadesListViewModel,
  buildNovedadFormViewModel,
} = require("../../lib/adminNovedadesView");

function getSessionUserName(req) {
  return req.session.nombre;
}

async function list(req, res) {
  try {
    var novedades = await novedadesService.listNovedades();

    res.render(
      "admin/novedades",
      buildNovedadesListViewModel(getSessionUserName(req), novedades)
    );
  } catch (error) {
    console.log(error);
    res.render(
      "admin/novedades",
      buildNovedadesListViewModel(
        getSessionUserName(req),
        [],
        true,
        "No se pudieron cargar las novedades"
      )
    );
  }
}

function showAddForm(req, res) {
  res.render(
    "admin/agregar",
    buildNovedadFormViewModel({
      estado: 1,
    })
  );
}

async function create(req, res) {
  try {
    await novedadesService.createNovedad(req.body);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.render(
      "admin/agregar",
      buildNovedadFormViewModel(
        req.body,
        true,
        "No se cargo la novedad. Revisa titulo, descripcion, fecha y estado."
      )
    );
  }
}

async function remove(req, res) {
  try {
    await novedadesService.deleteNovedad(req.params.id);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/admin/novedades");
}

async function showEditForm(req, res) {
  try {
    var novedad = await novedadesService.getNovedadById(req.params.id);

    if (!novedad) {
      return res.redirect("/admin/novedades");
    }

    res.render("admin/modificar", buildNovedadFormViewModel(novedad));
  } catch (error) {
    console.log(error);
    res.redirect("/admin/novedades");
  }
}

async function update(req, res) {
  try {
    await novedadesService.updateNovedad(req.body.id, req.body);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.render(
      "admin/modificar",
      buildNovedadFormViewModel(
        req.body,
        true,
        "No se modifico la novedad. Revisa titulo, descripcion, fecha y estado."
      )
    );
  }
}

module.exports = {
  list,
  showAddForm,
  create,
  remove,
  showEditForm,
  update,
};
