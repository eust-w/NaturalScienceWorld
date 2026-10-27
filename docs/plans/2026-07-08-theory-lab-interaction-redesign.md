# Theory Lab Interaction Redesign

Date: 2026-07-08

## Goal

Rebuild the Theory Lab from interaction flows and image-generated prototypes. The new
interface should feel like a research instrument for the hyperbook, not a generic card
dashboard.

## Product Roles

- **Reader**: enters from the hyperbook, wants an understandable map of theories.
- **Researcher**: compares theory status, evidence, dimensions, and unresolved questions.
- **Builder**: adjusts toy-model parameters and connects experiments back to chapters.

## Core Navigation

The app uses four workspace modes:

1. **Theory Map** - the default Chinese workspace for browsing theory families.
2. **Dimension Lab** - an interactive parameter surface for running toy demonstrations.
3. **Hyperbook** - chapter outline and claim cards synced to the selected theory.
4. **Research Hub** - registry-style table, evidence trail, and hypothesis queue.

Language switching remains global. The first visit defaults to Chinese. The chosen
language persists locally.

## Interaction 1: Theory Map

Entry: default app screen.

User actions:

- switch theory lens: all, spacetime, quantum, information, cosmology, hypotheses;
- click a theory node on the map;
- open the selected theory in the side inspector;
- jump from the inspector to lab, hyperbook, or research hub.

Feedback:

- selected node gains a visible orbit/ring;
- inspector updates immediately;
- status colors distinguish established, active research, working model, and speculative.

Prototype: full desktop app screen, map-centered, Chinese default.

## Interaction 2: Dimension Lab

Entry: click "Lab" from selected theory or top navigation.

User actions:

- adjust spatial dimension, energy scale, and information coupling;
- run a pulse;
- compare geometry load, observability, and hypothesis pressure;
- inspect a small timeline of run outputs.

Feedback:

- visual field responds to slider values;
- pulse animation makes the selected theory feel connected to the model;
- output meters and timeline update with every run.

Prototype: desktop experiment screen with one large visual canvas and right-side metrics.

## Interaction 3: Hyperbook Sync

Entry: click "Hyperbook" or jump from the selected theory inspector.

User actions:

- scan chapter outline;
- select a claim card;
- see status boundary: established, active research, working model, speculative;
- jump back to the map or research evidence.

Feedback:

- selected theory stays visible in a compact rail;
- claim cards are grouped by status;
- demo hook is shown as a code-native link target.

Prototype: reading workspace with generous typography and a synchronized theory rail.

## Interaction 4: Research Hub

Entry: click "Research" or jump from a claim.

User actions:

- search/filter the theory registry;
- inspect evidence and open questions;
- add or select a hypothesis seed;
- view demo hook and falsification path.

Feedback:

- table/list selection updates a detail pane;
- status labels remain visually consistent with the map;
- speculative items are clearly separated from established theories.

Prototype: dense but calm research table/detail screen.

## Interaction 5: Mobile

Entry: small viewport.

User actions:

- use bottom mode navigation;
- switch lens from compact controls;
- tap theory nodes or rows;
- open details as a stacked section instead of a desktop side panel.

Feedback:

- no horizontal overflow;
- map remains inspectable;
- primary actions remain reachable by thumb.

Prototype: mobile app screen, Chinese default, map-first.

## Generated Prototypes

- `hyperbook/assets/prototypes/theory-lab-map-desktop.png`
- `hyperbook/assets/prototypes/theory-lab-dimension-lab.png`
- `hyperbook/assets/prototypes/theory-lab-hyperbook-sync.png`
- `hyperbook/assets/prototypes/theory-lab-research-hub.png`
- `hyperbook/assets/prototypes/theory-lab-mobile-map.png`

## Extracted Design System

- Background: true white surfaces with a very light neutral page background.
- Accent: deep research green for active navigation, selected nodes, and primary actions.
- Status colors: green for established, blue for active research, amber for working model,
  rose for speculative.
- Container model: app shell with thin rails, open canvases, table/list regions, and
  right-side inspectors. Avoid nested card stacks.
- Radii: 8px or below for controls and panels.
- Typography: compact UI labels, generous reading typography in Hyperbook mode, no
  viewport-scaled font sizes.
- Icons: lucide-style line icons, consistent stroke weight, used only for navigation,
  actions, and status affordances.
- Motion: selected theory orbit on the map and pulse feedback in the lab; respect reduced
  motion when later adding more animation.
