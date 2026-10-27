import { readFileSync } from "node:fs";

const registryUrl = new URL("../theories/theory-registry.json", import.meta.url);
const registry = JSON.parse(readFileSync(registryUrl, "utf8"));

const scaleWeights = {
  planck: 10,
  quantum: 20,
  particle: 30,
  atomic: 40,
  human: 55,
  planetary: 65,
  stellar: 75,
  cosmic: 90
};

const statusWeights = {
  established: 4,
  "active-research": 3,
  "working-model": 2,
  speculative: 1
};

function average(numbers) {
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function coverageScore(theory) {
  const scaleScore = average(theory.scale.map((item) => scaleWeights[item] ?? 50));
  const dimensionBreadth = Object.keys(theory.dimension_model).length;
  const statusScore = statusWeights[theory.status] ?? 1;

  return Math.round(scaleScore * 0.45 + dimensionBreadth * 8 + statusScore * 9);
}

const rows = registry.theories
  .map((theory) => ({
    id: theory.id,
    status: theory.status,
    scales: theory.scale.join(", "),
    dimensions: Object.keys(theory.dimension_model).join(", "),
    score: coverageScore(theory)
  }))
  .sort((a, b) => b.score - a.score);

console.log("\nNaturalScienceWorld dimensional scale model");
console.log("This is a project-local toy score for registry coverage, not a physics claim.\n");
console.table(rows);
