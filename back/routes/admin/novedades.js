var express = require("express");
var router = express.Router();
var novedadesModel = require("../../models/novedadesModel");
var { buildNovedadInput } = require("../../lib/novedadesContract");

function buildAdminViewNovedad(novedad) {
  var estado = novedad && (novedad.estado === 0 || novedad.estado === "0") ? 0 : 1;

  return {
    ...novedad,
    estado,
    estado_activo: estado === 1,
    estado_inactivo: estado === 0,
  };
}

// Mostrar todas las novedades
router.get("/", async function (req, res, next) {
  try {
    var novedades = await novedadesModel.getNovedades();
    res.render("admin/novedades", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      novedades,
    });
  } catch (error) {
    console.log(error);
    res.render("admin/novedades", {
      layout: "admin/layout",
      usuario: req.session.nombre,
      novedades: [],
      error: true,
      message: "No se pudieron cargar las novedades",
    });
  }
});

// Formulario para agregar novedad
router.get("/agregar", (req, res, next) => {
  res.render("admin/agregar", {
    layout: "admin/layout",
    novedad: buildAdminViewNovedad({
      estado: 1,
    }),
  });
});

// Agregar novedad
router.post("/agregar", async (req, res, next) => {
  try {
    var novedad = buildNovedadInput(req.body);
    await novedadesModel.insertNovedad(novedad);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.render("admin/agregar", {
      layout: "admin/layout",
      error: true,
      message: "No se cargo la novedad. Revisa titulo, descripcion, fecha y estado.",
      novedad: buildAdminViewNovedad(req.body),
    });
  }
});

// Eliminar novedad
router.get("/eliminar/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    await novedadesModel.deleteNovedadesById(id);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/novedades");
  }
});

// Formulario para modificar novedad
router.get("/modificar/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    var novedad = await novedadesModel.getNovedadById(id);

    if (!novedad) {
      return res.redirect("/admin/novedades");
    }

    res.render("admin/modificar", {
      layout: "admin/layout",
      novedad: buildAdminViewNovedad(novedad),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/novedades");
  }
});

// Modificar novedad
router.post("/modificar", async (req, res, next) => {
  try {
    var obj = buildNovedadInput(req.body);
    await novedadesModel.modificarNovedadById(obj, req.body.id);
    res.redirect("/admin/novedades");
  } catch (error) {
    console.log(error);
    res.render("admin/modificar", {
      layout: "admin/layout",
      error: true,
      message: "No se modifico la novedad. Revisa titulo, descripcion, fecha y estado.",
      novedad: buildAdminViewNovedad(req.body),
    });
  }
});

module.exports = router;
