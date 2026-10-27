# Research Hub

This directory is the structured research track.

It keeps theory metadata, reproducible experiments, hypothesis templates, and publication
prep separate from prose chapters and the interactive app.

## Contents

- `theories/theory-registry.json` - canonical theory metadata.
- `theories/theory-registry.schema.json` - registry shape.
- `scripts/validate-registry.mjs` - dependency-free registry validation.
- `experiments/` - deterministic demos and model probes.
- `templates/` - reusable research note and hypothesis formats.

## Commands

```bash
npm run validate:registry
npm run demo:dimensions
```
