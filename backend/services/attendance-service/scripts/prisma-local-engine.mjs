import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const env = { ...process.env };

if (process.platform === "win32" && !env.PRISMA_SCHEMA_ENGINE_BINARY) {
  const schemaEngine = resolve(
    "node_modules",
    "@prisma",
    "engines",
    "schema-engine-windows.exe",
  );

  if (existsSync(schemaEngine)) {
    env.PRISMA_SCHEMA_ENGINE_BINARY = schemaEngine;
  }
}

const prismaCli = resolve("node_modules", "prisma", "build", "index.js");
const child = spawn(process.execPath, [prismaCli, ...args], {
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
