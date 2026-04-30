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

console.log("Frontend structure validation passed.");
