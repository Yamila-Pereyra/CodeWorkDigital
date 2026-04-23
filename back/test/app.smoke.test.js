var test = require("node:test");
var assert = require("node:assert/strict");
var http = require("node:http");

test("backend app carga y responde en rutas base sin infraestructura externa", async function () {
  var previousNodeEnv = process.env.NODE_ENV;
  var previousSessionSecret = process.env.SESSION_SECRET;
  var previousCors = process.env.CORS_ALLOWED_ORIGINS;

  process.env.NODE_ENV = "test";
  process.env.SESSION_SECRET = "test-session-secret";
  process.env.CORS_ALLOWED_ORIGINS = "http://localhost:3000";

  var app = require("../app");
  var server = http.createServer(app);

  await new Promise(function (resolve) {
    server.listen(0, "127.0.0.1", resolve);
  });

  var address = server.address();
  var baseUrl = "http://127.0.0.1:" + address.port;

  try {
    var loginResponse = await fetch(baseUrl + "/admin/login");
    assert.equal(loginResponse.status, 200);
    assert.match(await loginResponse.text(), /Iniciar sesion|login|usuario/i);

    var apiNotFound = await fetch(baseUrl + "/api/no-existe");
    assert.equal(apiNotFound.status, 404);

    var apiPayload = await apiNotFound.json();
    assert.equal(apiPayload.error, true);
    assert.match(apiPayload.message, /Not found/i);
  } finally {
    await new Promise(function (resolve, reject) {
      server.close(function (error) {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }

    if (previousSessionSecret === undefined) {
      delete process.env.SESSION_SECRET;
    } else {
      process.env.SESSION_SECRET = previousSessionSecret;
    }

    if (previousCors === undefined) {
      delete process.env.CORS_ALLOWED_ORIGINS;
    } else {
      process.env.CORS_ALLOWED_ORIGINS = previousCors;
    }
  }
});
