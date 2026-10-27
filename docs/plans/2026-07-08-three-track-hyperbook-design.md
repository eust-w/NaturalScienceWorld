# Three-Track Hyperbook Design

Date: 2026-07-08

## Goal

Initialize NaturalScienceWorld as a hyperbook about the universe: a long-form theory
library, an executable demonstration environment, and a research/publication system.

The user requested all three modes at once:

1. Markdown-first hyperbook.
2. Interactive universe theory laboratory.
3. Research repository plus publication site foundation.

## Architecture

The repository is split into three main directories:

- `hyperbook/` keeps the narrative source of truth: chapters, assets, demos linked from
  prose, and references.
- `theory-lab/` contains the live interactive web app. It should make abstract ideas
  visible through controls, theory maps, and repeatable visual experiments.
- `research-hub/` contains structured data and scripts. It tracks theory status,
  dimensions, scale, claims, open questions, and demo hooks.

Root scripts connect the tracks:

- `npm run dev` runs the interactive lab.
- `npm run demo:dimensions` runs a deterministic console demo from registry data.
- `npm run validate:registry` checks structured theory data.
- `npm run check` validates registry data and builds the lab.

## Content Rules

Every theory entry should distinguish:

- What is established.
- What is unresolved.
- What is a project-local interpretation.
- What is speculative.

The hyperbook can be ambitious, but claims should remain status-labeled and source-aware.
Speculation is allowed when it is clearly marked and connected to testable or visualizable
models.
