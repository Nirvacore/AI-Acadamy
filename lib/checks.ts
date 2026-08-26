import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { CheckItem } from "@/lib/types";

type ChecksFile = { checks: Record<string, CheckItem[]> };

const root = process.cwd();

export function loadChecks(): Record<string, CheckItem[]> {
  const raw = fs.readFileSync(path.join(root, "content/checks.yaml"), "utf8");
  return (yaml.load(raw) as ChecksFile).checks;
}

export function checksFor(lessonId: string): CheckItem[] {
  return loadChecks()[lessonId] ?? [];
}
