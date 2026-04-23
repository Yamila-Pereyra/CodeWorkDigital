import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function assertIncludes(content, token, file) {
  if (!content.includes(token)) {
    throw new Error(`${file} is missing required token "${token}"`);
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
].forEach((token) => assertIncludes(seed, token, seedFile));

console.log("Database bootstrap validation passed.");
