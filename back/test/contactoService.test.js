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

test("sendContactMessage usa CONTACT_FORM_RECIPIENT y arma el mail esperado", async function () {
  var previousRecipient = process.env.CONTACT_FORM_RECIPIENT;
  var sentMail = null;
  process.env.CONTACT_FORM_RECIPIENT = "contacto@example.com";

  try {
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

    assert.equal(sentMail.to, "contacto@example.com");
    assert.equal(sentMail.subject, "Contacto web");
    assert.match(sentMail.html, /Ana/);
    assert.match(sentMail.html, /ana@example.com/);
    assert.match(sentMail.html, /Quiero informacion/);
  } finally {
    if (previousRecipient === undefined) {
      delete process.env.CONTACT_FORM_RECIPIENT;
    } else {
      process.env.CONTACT_FORM_RECIPIENT = previousRecipient;
    }
  }
});

test("sendContactMessage falla con error explícito si falta CONTACT_FORM_RECIPIENT", async function () {
  var previousRecipient = process.env.CONTACT_FORM_RECIPIENT;
  delete process.env.CONTACT_FORM_RECIPIENT;

  try {
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
          email: "ana@example.com",
          mensaje: "Hola",
        });
      },
      function (error) {
        assert.equal(error.status, 500);
        assert.match(error.message, /CONTACT_FORM_RECIPIENT/);
        return true;
      }
    );
  } finally {
    if (previousRecipient === undefined) {
      delete process.env.CONTACT_FORM_RECIPIENT;
    } else {
      process.env.CONTACT_FORM_RECIPIENT = previousRecipient;
    }
  }
});
