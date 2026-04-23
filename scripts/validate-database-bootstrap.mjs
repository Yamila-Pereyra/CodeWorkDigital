import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const { verifyPassword } = require(path.join(root, "back/lib/passwords.js"));

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function assertIncludes(content, token, file) {
  if (!content.includes(token)) {
    throw new Error(`${file} is missing required token "${token}"`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const schemaFile = "database/schema.sql";
const seedFile = "database/seed.sql";

const schema = read(schemaFile);
const seed = read(seedFile);

[
  "CREATE TABLE IF NOT EXISTS usuarios",
  "id INT NOT NULL AUTO_INCREMENT",
  "usuario VARCHAR(100)",
  "password VARCHAR(255)",
  "UNIQUE KEY usuarios_usuario_unique (usuario)",
  "CREATE TABLE IF NOT EXISTS novedades",
].forEach((token) => assertIncludes(schema, token, schemaFile));

[
  "INSERT INTO usuarios",
  "'admin'",
  "scrypt$",
  "WHERE NOT EXISTS",
  "INSERT INTO novedades",
  "Idempotence criteria: titulo + fecha_publicacion",
].forEach((token) => assertIncludes(seed, token, seedFile));

const adminHashMatch = seed.match(/'scrypt\$[^']+'/);
assert(adminHashMatch, "database/seed.sql must include a scrypt bootstrap hash for admin");

const adminHash = adminHashMatch[0].slice(1, -1);
const verification = await verifyPassword("admin1234", adminHash);
assert(verification.valid, "bootstrap admin hash must be valid for password admin1234");
assert(!verification.needsUpgrade, "bootstrap admin hash must not require legacy upgrade");

const novedadesInsertMatches = [...seed.matchAll(/INSERT INTO novedades/g)];
assert(
  novedadesInsertMatches.length === 3,
  "database/seed.sql must define exactly 3 canonical novedades bootstrap inserts"
);

const novedadesWhereNotExistsMatches = [...seed.matchAll(/WHERE NOT EXISTS \(\s*SELECT 1\s*FROM novedades/gs)];
assert(
  novedadesWhereNotExistsMatches.length === 3,
  "each canonical novedad seed row must be protected by WHERE NOT EXISTS"
);

[
  ["Tendencias diseno web 2026: claves para adelantarte al futuro", "2026-01-15"],
  ["10 elementos de una pagina web de exito", "2026-02-10"],
  ["Prueba interna", "2026-03-01"],
].forEach(([titulo, fecha]) => {
  assertIncludes(seed, `WHERE titulo = '${titulo}'`, seedFile);
  assertIncludes(seed, `AND fecha_publicacion = '${fecha}'`, seedFile);
});

console.log("Database bootstrap validation passed.");
