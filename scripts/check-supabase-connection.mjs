import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readLocalEnv() {
  const envPath = resolve(".env.local");
  const contents = readFileSync(envPath, "utf8");
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

const env = readLocalEnv();
const supabaseUrl = env.SUPABASE_URL;
const publishableKey = env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env.local");
}

const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
  headers: {
    apikey: publishableKey,
  },
});

if (!response.ok) {
  throw new Error(`Supabase health check failed with HTTP ${response.status}`);
}

const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
console.log(`Supabase connection OK: ${projectRef}`);
