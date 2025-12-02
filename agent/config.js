import { join } from "node:path";
import { homedir } from "node:os";
import { readFile } from "node:fs/promises";

export async function getSessionToken() {
  const token = await readFile(
    join(getConfigDir("advent-of-code"), "adventofcode.session"),
    "utf8",
  );
  return token.trim();
}

function getConfigDir() {
  const home = homedir();

  if (process.platform === "win32") {
    return process.env.APPDATA ?? join(home, "AppData", "Roaming");
  }

  if (process.platform === "darwin") {
    return join(home, "Library", "Application Support");
  }

  return process.env.XDG_CONFIG_HOME ?? join(home, ".config");
}
