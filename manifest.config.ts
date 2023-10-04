import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
// const [major, minor, patch, label = "0"] = version
//   .replace(/[^\d.-]+/g, "")
//   .split(/[.-]/);

export const manifest = defineManifest((env) => ({
    //   manifest_version: 3,
    //   name: env.mode === "staging" ? "[dev] Chord Dictionary" : "Chord Dictionary",
    //   version: `${major}.${minor}.${patch}.${label}`,
    //   version_name: version,
}));
