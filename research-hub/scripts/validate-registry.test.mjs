import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as validator from "./validate-registry.mjs";

function validate(registry, options) {
  assert.equal(typeof validator.validateRegistry, "function", "export a reusable registry validator");
  return validator.validateRegistry(registry, options);
}

function fixture() {
  return {
    version: "0.1.0", updated: "2026-10-28",
    theories: [{
      id: "example-theory", name: "Example Theory", status: "established",
      domain: ["motion"], scale: ["human"], dimension_model: { physical: "3D" },
      core_claim: "An educational example.", evidence: ["Illustrative experiment"],
      open_questions: ["Scope"], demo_hooks: ["example-demo"],
      sources: [{ citation_key: "example2026", title: "Example reference", url: "https://example.org/paper", role: "background", note: "Background only." }]
    }]
  };
}

test("accepts a well-formed registry with a resolvable bibliography key", () => {
  assert.deepEqual(validate(fixture(), { bibliographyKeys: new Set(["example2026"]) }), []);
});

test("malformed roots return diagnostics without throwing", () => {
  for (const value of [null, [], "registry", 42]) {
    assert.match(validate(value).join("\n"), /registry must be an object/);
  }
});

test("malformed theory collections and null entries return diagnostics", () => {
  for (const value of [null, {}, "theories", []]) {
    assert.match(validate({ ...fixture(), theories: value }).join("\n"), /theories must be a non-empty array/);
  }
  assert.match(validate({ ...fixture(), theories: [null, "theory", []] }).join("\n"), /theories\[0\]: must be an object/);
});

test("duplicate and malformed IDs are rejected", () => {
  const data = fixture();
  data.theories.push(structuredClone(data.theories[0]));
  assert.match(validate(data).join("\n"), /duplicate id/);
  data.theories[1].id = "Not a stable ID";
  assert.match(validate(data).join("\n"), /lowercase kebab-case/);
});

test("missing fields, empty descriptions and invalid status are rejected", () => {
  const data = fixture();
  data.version = " ";
  const theory = data.theories[0];
  delete theory.name;
  theory.core_claim = " ";
  theory.status = "proven";
  theory.domain = [""];
  theory.dimension_model = { physical: "" };
  const errors = validate(data).join("\n");
  for (const pattern of [/version/, /missing required field "name"/, /core_claim/, /status/, /domain/, /dimension_model/]) {
    assert.match(errors, pattern);
  }
});

test("updated requires a real ISO calendar date", () => {
  for (const updated of ["2026-02-30", "2026-13-01", "today", null]) {
    assert.match(validate({ ...fixture(), updated }).join("\n"), /valid YYYY-MM-DD date/);
  }
  assert.deepEqual(validate({ ...fixture(), updated: "2024-02-29" }), []);
});

test("references require a safe HTTPS URL and a known citation key", () => {
  const data = fixture();
  const source = data.theories[0].sources[0];
  for (const url of ["javascript:alert(1)", "https://user:password@example.org/paper", "not-a-url", "http://example.org"]) {
    source.url = url;
    assert.match(validate(data).join("\n"), /credential-free HTTPS URL/);
  }
  source.url = "https://example.org/paper";
  assert.match(validate(data, { bibliographyKeys: new Set() }).join("\n"), /unknown bibliography key/);
});

test("malformed and duplicate references produce useful diagnostics", () => {
  const data = fixture();
  data.theories[0].sources.push(structuredClone(data.theories[0].sources[0]), null, {});
  const errors = validate(data).join("\n");
  assert.match(errors, /duplicate citation_key/);
  assert.match(errors, /sources\[2\]: must be an object/);
  assert.match(errors, /title must be a non-empty string/);
  assert.match(errors, /role must be one of/);
  data.theories[0].sources = null;
  assert.match(validate(data).join("\n"), /sources must be an array/);
});

test("established and active research entries need sources; project models need a boundary note", () => {
  const data = fixture();
  data.theories[0].sources = [];
  assert.match(validate(data).join("\n"), /requires at least one source/);
  for (const status of ["working-model", "speculative"]) {
    data.theories[0].status = status;
    assert.match(validate(data).join("\n"), /notes must explain the project-local evidence boundary/);
    data.theories[0].notes = "Project-local hypothesis with no empirical validation.";
    assert.deepEqual(validate(data), []);
    data.theories[0].sources = [{ ...fixture().theories[0].sources[0], role: "empirical-evidence" }];
    assert.match(validate(data).join("\n"), /cannot claim empirical evidence for a project-local model/);
    data.theories[0].sources = [];
    delete data.theories[0].notes;
  }
});

test("the checked-in registry resolves all source keys in the bibliography", () => {
  const registry = JSON.parse(readFileSync(new URL("../theories/theory-registry.json", import.meta.url), "utf8"));
  const bibliography = readFileSync(new URL("../../hyperbook/references/references.bib", import.meta.url), "utf8");
  const bibliographyKeys = new Set([...bibliography.matchAll(/@\w+\s*\{\s*([^,\s]+)\s*,/g)].map((match) => match[1]));
  assert.deepEqual(validate(registry, { bibliographyKeys }), []);
});
