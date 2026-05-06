import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const trackedFiles = execFileSync("git", ["ls-files"], {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => existsSync(path.join(root, file)));

const disallowedPatterns = [
  {
    description: "tracked node_modules artifact",
    test: (file) => file.includes("node_modules/"),
  },
  {
    description: "tracked Next build artifact",
    test: (file) => file.includes(".next/"),
  },
  {
    description: "tracked deprecated frontend copy",
    test: (file) => file === "front" || file.startsWith("front/"),
  },
  {
    description: "tracked IDE metadata",
    test: (file) => file.startsWith(".idea/"),
  },
  {
    description: "tracked log file",
    test: (file) => file.endsWith(".log"),
  },
];

const violations = trackedFiles.filter((file) =>
  disallowedPatterns.some((pattern) => pattern.test(file))
);

if (violations.length) {
  console.error("Repository hygiene validation failed.");
  violations.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("Repository hygiene validation passed.");
