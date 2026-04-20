import {mkdirSync, writeFileSync} from "node:fs";
import {dirname} from "node:path";

export function writeJsonArtifact(path: string, payload: unknown) {
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

export function writeTextArtifact(path: string, content: string) {
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, content, "utf-8");
}
