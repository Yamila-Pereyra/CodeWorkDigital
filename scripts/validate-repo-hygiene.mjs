import { execFileSync } from "node:child_process";

const trackedFiles = execFileSync("git", ["ls-files"], {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean);

const disallowedPatterns = [
  {
    description: "tracked env file",
    test: (file) => /\.env($|\.)/.test(file) && !file.endsWith(".env.example"),
  },
  {
    description: "tracked node_modules artifact",
    test: (file) => file.includes("node_modules/"),
  },
  {
    description: "tracked Next build artifact",
    test: (file) => file.includes(".next/"),
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
