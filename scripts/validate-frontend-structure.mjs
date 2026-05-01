import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`Structural validation failed: ${message}`);
  process.exit(1);
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) {
    fail(`missing required file: ${relativePath}`);
  }

  return JSON.parse(readFileSync(fullPath, "utf8"));
}

const rootPackage = readJson("package.json");

if (rootPackage.name !== "codeworkdigital-frontend") {
  fail('root package name must be "codeworkdigital-frontend"');
}

["src", "src/app", "public", "next.config.mjs"].forEach((relativePath) => {
  if (!existsSync(path.join(root, relativePath))) {
    fail(`missing canonical frontend path: ${relativePath}`);
  }
});

if (!rootPackage.scripts?.dev || !rootPackage.scripts?.build || !rootPackage.scripts?.start) {
  fail("root package.json must expose dev, build and start scripts");
}

if (existsSync(path.join(root, "front"))) {
  fail("front/ must not exist; the root frontend is the only active frontend");
}

const homePage = readFileSync(path.join(root, "src/app/page.js"), "utf8");
const homeStyles = readFileSync(path.join(root, "src/app/home1.css"), "utf8");
const serviciosPage = readFileSync(path.join(root, "src/app/servicios/page.js"), "utf8");
const serviciosStyles = readFileSync(path.join(root, "src/styles/servicios.css"), "utf8");
const novedadesPage = readFileSync(path.join(root, "src/app/novedades/page.js"), "utf8");
const novedadesStyles = readFileSync(path.join(root, "src/styles/novedades.css"), "utf8");

if (homePage.includes('className="service-card"')) {
  fail('home page must use home-specific service card classes instead of "service-card"');
}

[
  'className="home-services"',
  'className="home-service-card"',
].forEach((token) => {
  if (!homePage.includes(token)) {
    fail(`home page is missing required token: ${token}`);
  }
});

[
  ".home-service-card h3",
  ".home-service-card p",
  ".home-service-card:hover h3",
  ".home-service-card:hover p",
].forEach((selector) => {
  if (!homeStyles.includes(selector)) {
    fail(`home styles are missing service card selector: ${selector}`);
  }
});

[
  ["servicios page", serviciosPage, 'className="servicios-cards-wrapper"'],
  ["novedades page", novedadesPage, 'className="novedades-cards-wrapper"'],
].forEach(([label, content, requiredToken]) => {
  if (content.includes('className="cards-wrapper"')) {
    fail(`${label} must use a page-specific cards wrapper instead of "cards-wrapper"`);
  }

  if (!content.includes(requiredToken)) {
    fail(`${label} is missing required token: ${requiredToken}`);
  }
});

[
  ["servicios styles", serviciosStyles, ".servicios-cards-wrapper"],
  ["novedades styles", novedadesStyles, ".novedades-cards-wrapper"],
].forEach(([label, content, requiredSelector]) => {
  if (content.includes(".cards-wrapper")) {
    fail(`${label} must not define generic .cards-wrapper`);
  }

  if (!content.includes(requiredSelector)) {
    fail(`${label} is missing required selector: ${requiredSelector}`);
  }
});

console.log("Frontend structure validation passed.");
