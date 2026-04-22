var contactoService = require("../services/contactoService");
var novedadesService = require("../services/novedadesService");

async function getNovedades(req, res) {
  var novedades = await novedadesService.listPublicNovedades();
  res.json(novedades);
}

async function postContacto(req, res) {
  await contactoService.sendContactMessage(req.body);

  res.status(201).json({
    error: false,
    message: "Mensaje enviado",
  });
}

module.exports = {
  getNovedades,
  postContacto,
};
