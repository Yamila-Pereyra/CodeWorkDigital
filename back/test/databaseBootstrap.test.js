var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("node:fs");
var path = require("node:path");
var { verifyPassword } = require("../lib/passwords");

var seedPath = path.join(__dirname, "..", "..", "database", "seed.sql");
var seed = fs.readFileSync(seedPath, "utf8");

function getAdminBootstrapHash() {
  var match = seed.match(/'scrypt\$[^']+'/);

  if (!match) {
    throw new Error("Admin bootstrap hash not found in database/seed.sql");
  }

  return match[0].slice(1, -1);
}

test("database bootstrap admin hash is compatible with active password verification", async function () {
  var verification = await verifyPassword("admin1234", getAdminBootstrapHash());

  assert.equal(verification.valid, true);
  assert.equal(verification.needsUpgrade, false);
});

test("database seed keeps admin bootstrap idempotent", function () {
  assert.match(seed, /INSERT INTO usuarios/);
  assert.match(seed, /WHERE usuario = 'admin'/);
  assert.match(seed, /WHERE NOT EXISTS/);
});

test("database seed keeps legacy novedades idempotent row by row", function () {
  var insertCount = (seed.match(/INSERT INTO novedades/g) || []).length;
  var guardCount = (seed.match(/WHERE NOT EXISTS \(\s*SELECT 1\s*FROM novedades/gs) || []).length;

  assert.equal(insertCount, 3);
  assert.equal(guardCount, 3);

  [
    "Tendencias diseno web 2026: claves para adelantarte al futuro",
    "10 elementos de una pagina web de exito",
    "Prueba interna",
  ].forEach(function (titulo) {
    assert.match(seed, new RegExp(`WHERE titulo = '${titulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
  });

  assert.doesNotMatch(seed, /descripcion|fecha_publicacion|estado|img_id|link/);
});
