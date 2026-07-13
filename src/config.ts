import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Config {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  name: string;
  version: string;
}

const BASE_URL = "https://api.abuseipdb.com/api/v2";
const DEFAULT_TIMEOUT_MS = 10_000;

function loadPackageInfo(): { name: string; version: string } {
  const pkgPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "package.json",
  );
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return { name: pkg.name, version: pkg.version };
}

export function loadConfig(): Config {
  const apiKey = process.env.ABUSEIPDB_API_KEY;

  if (!apiKey) {
    process.stderr.write(
      "Error: ABUSEIPDB_API_KEY environment variable is required\n",
    );
    process.exit(1);
  }

  const { name, version } = loadPackageInfo();

  return {
    apiKey,
    baseUrl: BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    name,
    version,
  };
}
