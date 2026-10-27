import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const allowedStatuses = new Set(["established", "active-research", "working-model", "speculative"]);
const sourceRoles = new Set(["background", "empirical-evidence", "theoretical-background"]);
const requiredFields = ["id", "name", "status", "domain", "scale", "dimension_model", "core_claim", "evidence", "open_questions", "demo_hooks", "sources"];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}
function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function isSourceUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

// Structural checks are offline. They do not establish scientific validity or URL availability.
export function validateRegistry(registry, { bibliographyKeys } = {}) {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (!isObject(registry)) return ["registry must be an object"];
  if (!isNonEmptyString(registry.version)) fail("registry.version must be a non-empty string");
  if (!isIsoDate(registry.updated)) fail("registry.updated must be a valid YYYY-MM-DD date");
  if (!Array.isArray(registry.theories) || registry.theories.length === 0) {
    fail("registry.theories must be a non-empty array");
    return errors;
  }
  const ids = new Set();
  for (const [index, theory] of registry.theories.entries()) {
    if (!isObject(theory)) {
      fail(`theories[${index}]: must be an object`);
      continue;
    }
    const label = isNonEmptyString(theory.id) ? theory.id : `theories[${index}]`;
    for (const field of requiredFields) {
      if (!Object.hasOwn(theory, field)) fail(`${label}: missing required field "${field}"`);
    }
    if (!isNonEmptyString(theory.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theory.id)) {
      fail(`${label}: id must use lowercase kebab-case`);
    } else if (ids.has(theory.id)) {
      fail(`${label}: duplicate id`);
    } else {
      ids.add(theory.id);
    }
    for (const field of ["name", "core_claim"]) {
      if (!isNonEmptyString(theory[field])) fail(`${label}: ${field} must be a non-empty string`);
    }
    if (!allowedStatuses.has(theory.status)) fail(`${label}: status must be one of ${[...allowedStatuses].join(", ")}`);
    for (const field of ["domain", "scale", "evidence", "open_questions", "demo_hooks"]) {
      if (!isNonEmptyStringArray(theory[field])) fail(`${label}: ${field} must be a non-empty string array`);
    }
    if (!isObject(theory.dimension_model) || Object.keys(theory.dimension_model).length === 0 || !Object.values(theory.dimension_model).every(isNonEmptyString)) {
      fail(`${label}: dimension_model must be a non-empty object of non-empty strings`);
    }
    const projectLocal = theory.status === "working-model" || theory.status === "speculative";
    if (projectLocal && !isNonEmptyString(theory.notes)) fail(`${label}: notes must explain the project-local evidence boundary`);
    if (!Array.isArray(theory.sources)) {
      fail(`${label}: sources must be an array`);
      continue;
    }
    if (["established", "active-research"].includes(theory.status) && theory.sources.length === 0) fail(`${label}: ${theory.status} requires at least one source`);
    const citationKeys = new Set();
    for (const [sourceIndex, source] of theory.sources.entries()) {
      const sourceLabel = `${label}.sources[${sourceIndex}]`;
      if (!isObject(source)) {
        fail(`${sourceLabel}: must be an object`);
        continue;
      }
      for (const field of ["citation_key", "title", "note"]) {
        if (!isNonEmptyString(source[field])) fail(`${sourceLabel}: ${field} must be a non-empty string`);
      }
      if (isNonEmptyString(source.citation_key)) {
        if (citationKeys.has(source.citation_key)) fail(`${sourceLabel}: duplicate citation_key`);
        citationKeys.add(source.citation_key);
        if (bibliographyKeys && !bibliographyKeys.has(source.citation_key)) fail(`${sourceLabel}: unknown bibliography key "${source.citation_key}"`);
      }
      if (!isSourceUrl(source.url)) fail(`${sourceLabel}: url must be a credential-free HTTPS URL`);
      if (!sourceRoles.has(source.role)) fail(`${sourceLabel}: role must be one of ${[...sourceRoles].join(", ")}`);
      if (projectLocal && source.role === "empirical-evidence") fail(`${sourceLabel}: cannot claim empirical evidence for a project-local model`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const registry = JSON.parse(readFileSync(new URL("../theories/theory-registry.json", import.meta.url), "utf8"));
    const bibliography = readFileSync(new URL("../../hyperbook/references/references.bib", import.meta.url), "utf8");
    const bibliographyKeys = new Set([...bibliography.matchAll(/@\w+\s*\{\s*([^,\s]+)\s*,/g)].map((match) => match[1]));
    const errors = validateRegistry(registry, { bibliographyKeys });
    if (errors.length > 0) {
      console.error(`Theory registry validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
      process.exitCode = 1;
    } else {
      console.log(`Theory registry OK: ${registry.theories.length} theories validated.`);
    }
  } catch (error) {
    console.error(`Theory registry validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
