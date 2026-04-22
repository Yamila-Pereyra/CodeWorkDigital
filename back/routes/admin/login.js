var express = require("express");
var router = express.Router();
var createError = require("http-errors");
var usuarioModel = require("./../../models/usuariosModel");
var asyncHandler = require("../../lib/asyncHandler");

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

/* GET login */
router.get("/", function (req, res, next) {
  res.render("admin/login", {
    layout: "admin/layout",
  });
});

router.get(
  "/logout",
  asyncHandler(async function (req, res, next) {
    var cookieName = process.env.SESSION_COOKIE_NAME || "codework.sid";
    await destroySession(req);
    res.clearCookie(cookieName);
    res.redirect("/admin/login");
  })
);

/* POST login */
router.post(
  "/",
  asyncHandler(async function (req, res, next) {
    var usuario = req.body.usuario;
    var password = req.body.password;

    if (!usuario || !password) {
      res.status(400);
      return res.render("admin/login", {
        layout: "admin/layout",
        error: true,
      });
    }

    var data = await usuarioModel.verifyUserCredentials(usuario, password);

    if (!data) {
      res.status(401);
      return res.render("admin/login", {
        layout: "admin/layout",
        error: true,
      });
    }

    await regenerateSession(req);
    req.session.id_usuario = data.id;
    req.session.nombre = data.usuario;
    req.session.id_nombre = data.usuario;
    req.session.authenticated_at = new Date().toISOString();

    req.session.save((error) => {
      if (error) {
        next(createError(500, "No se pudo iniciar la sesion"));
        return;
      }

      res.redirect("/admin/novedades");
    });
  })
);

module.exports = router;
