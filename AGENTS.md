# NaturalScienceWorld Agent Guide

This repository is a three-track hyperbook project: prose, executable demonstrations,
and research-to-publication artifacts are first-class project outputs.

## Working Model

- Keep the three tracks separate and connected:
  - `hyperbook/` is the Markdown-first source for chapters, figures, and narrative.
  - `theory-lab/` is the interactive web lab for demonstrations and debugging.
  - `research-hub/` is the structured research registry, experiments, and publication prep.
- Treat established science, working interpretation, and speculative theory as different
  status levels. Do not blur them in copy, metadata, or UI.
- Prefer reproducible demonstrations over static claims. If a theory can be made visible
  or testable with code, add a demo hook or experiment.
- Cite sources when adding external claims. Put long-form references under
  `hyperbook/references/` or structured metadata under `research-hub/theories/`.

## Engineering Rules

- Use `npm run check` before handing off code changes when JavaScript/TypeScript changed.
- Use `npm run validate:registry` after editing theory registry data.
- Keep demos small, deterministic, and explainable. Avoid hidden network calls.
- Never hardcode secrets. Use environment variables for any future API-backed research tools.
- Verify `git remote -v` before changing, pushing, or assuming a repository remote.

## Public Release

- Keep credentials, local capture evidence, and unverified concept images out of releases.
- Use real application captures for product documentation and mark synthesized media.
- Report published, under review, and blocked platform states separately.
