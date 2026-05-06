var createError = require("http-errors");
var authService = require("../../services/authService");
var {
  regenerateSession,
  destroySession,
  saveSession,
  applyAuthenticatedUserSession,
} = require("../../lib/sessionManager");

function renderLogin(res, statusCode, error) {
  if (statusCode) {
    res.status(statusCode);
  }

  return res.render("admin/login", {
    layout: "admin/layout",
    error: Boolean(error),
  });
}

function showLogin(req, res) {
  return renderLogin(res);
}

async function logout(req, res) {
  await destroySession(req);
  res.clearCookie("connect.sid");
  res.redirect("/admin/login");
}

async function login(req, res, next) {
  try {
    var user = await authService.authenticateAdmin(req.body);

    await regenerateSession(req);
    applyAuthenticatedUserSession(req, user);
    await saveSession(req);

    res.redirect("/admin/novedades");
  } catch (error) {
    if (error.status === 400 || error.status === 401) {
      return renderLogin(res, error.status, true);
    }

    next(createError(500, "No se pudo iniciar la sesion"));
  }
}

module.exports = {
  showLogin,
  logout,
  login,
};
