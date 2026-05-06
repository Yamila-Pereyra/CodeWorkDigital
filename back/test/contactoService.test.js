var test = require("node:test");
var assert = require("node:assert/strict");
var { loadModuleWithMocks } = require("../test-support/loadModuleWithMocks");

test("sendContactMessage valida campos obligatorios antes de enviar", async function () {
  var service = loadModuleWithMocks("services/contactoService.js", {
    "../lib/mailer": {
      sendMail: async function () {
        throw new Error("sendMail no deberia ejecutarse");
      },
    },
  });

  await assert.rejects(
    function () {
      return service.sendContactMessage({
        nombre: "Ana",
        email: "",
        mensaje: "",
      });
    },
    function (error) {
      assert.equal(error.status, 400);
      assert.match(error.message, /Faltan campos obligatorios/);
      return true;
    }
  );
});

test("sendContactMessage usa destinatario original y arma el mail esperado", async function () {
  var sentMail = null;
  var service = loadModuleWithMocks("services/contactoService.js", {
    "../lib/mailer": {
      sendMail: async function (mail) {
        sentMail = mail;
      },
    },
  });

  await service.sendContactMessage({
    nombre: "Ana",
    email: "ana@example.com",
    mensaje: "Quiero informacion",
    telefono: "123456",
  });

  assert.equal(sentMail.to, "yamispereyra@gmail.com");
  assert.equal(sentMail.subject, "Contacto web");
  assert.match(sentMail.html, /Ana/);
  assert.match(sentMail.html, /ana@example.com/);
  assert.match(sentMail.html, /Quiero informacion/);
});
