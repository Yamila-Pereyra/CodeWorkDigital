var createError = require("http-errors");
var usuarioModel = require("../models/usuariosModel");

async function authenticateAdmin(credentials) {
  var usuario = credentials.usuario;
  var password = credentials.password;

  if (!usuario || !password) {
    throw createError(400, "Usuario y password son requeridos");
  }

  var user = await usuarioModel.verifyUserCredentials(usuario, password);

  if (!user) {
    throw createError(401, "Credenciales invalidas");
  }

  return user;
}

module.exports = {
  authenticateAdmin,
};
