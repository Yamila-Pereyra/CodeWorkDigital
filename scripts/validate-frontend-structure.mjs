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
  if (!existsSync(path.join(root, "front", "LEGACY_FRONTEND.md"))) {
    fail("front/ must include a legacy marker document");
  }

  const legacyPackage = readJson(path.join("front", "package.json"));

  if (legacyPackage.name !== "legacy-front-archive") {
    fail('front/package.json must be marked as "legacy-front-archive"');
  }

  ["dev", "build", "start"].forEach((scriptName) => {
    const scriptValue = legacyPackage.scripts?.[scriptName] || "";
    if (!scriptValue.includes("legacy-frontend-warning.mjs")) {
      fail(`front/package.json script "${scriptName}" must be blocked with the legacy warning`);
    }
  });
}

console.log("Frontend structure validation passed.");
