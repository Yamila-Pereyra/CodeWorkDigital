var createError = require("http-errors");
var { sendMail } = require("../lib/mailer");

function buildContactMail(payload) {
  return {
    to: "yamispereyra@gmail.com",
    subject: "Contacto web",
    html: `${payload.nombre} se contacto a traves de la web y quiere mas informacion a este correo: ${payload.email} <br>
               Ademas, hizo el siguiente comentario: ${payload.mensaje} <br>
               Su tel es: ${payload.telefono || ""}`,
  };
}

function validateContactPayload(payload) {
  if (!payload.nombre || !payload.email || !payload.mensaje) {
    throw createError(400, "Faltan campos obligatorios del formulario");
  }
}

async function sendContactMessage(payload) {
  validateContactPayload(payload);
  await sendMail(buildContactMail(payload));
}

module.exports = {
  sendContactMessage,
};
