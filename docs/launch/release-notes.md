# NaturalScienceWorld v0.1.0-alpha.1

A first public-facing Alpha of an interactive natural science hyperbook. Explore a bilingual theory map, inspect scientific status labels, adjust a toy visualization, and read the source behind the explanations.

## Included

- A React/TypeScript interface with Theory Map, Dimension Lab, Hyperbook, and Research Hub views.
- Chinese and English UI content, with layouts for desktop and mobile screens.
- A ten-entry JSON theory registry, nine web theory cards, Markdown chapter drafts, and a bibliography.
- Representative sources for eight registry entries, with citation roles and scope notes; seven appear in the UI, and two project-local entries explicitly have no supporting sources.
- A deterministic CLI example for comparing registry coverage.
- MIT licensing, contribution guidance, scientific evidence policy, and community issue templates.

## Known limits

The Dimension Lab uses project-defined illustrative formulas rather than physical equations of motion. Its outputs are not measurements or experimental validation. Named demo hooks remain a development roadmap.

The chapter reader contains previews; it is not a complete textbook renderer. Citations are imported from the JSON registry through ID mappings; bilingual summaries and other display metadata remain separate. The bibliography is not a complete evidence review or independent replication. The Observer Information Frame is a local organizing model, and Dimensional Resonance remains an unverified speculative seed.

## Try it

```bash
npm ci
npm run dev
```

Run `npm run check` to run tests, validate registry structure, type-check, and build. Run `npm run demo:dimensions` for the CLI example. These checks establish software behavior and data structure, not scientific validity.

Contributions that add primary references, accessible interactions, and small well-tested demonstrations are welcome. See [CONTRIBUTING.md](../../CONTRIBUTING.md).
