# NaturalScienceWorld

**Explore scientific ideas through a connected book, an interactive lab, and a structured research registry.**

[简体中文](README.zh-CN.md) · [Get started](#run-locally) · [Contribute](CONTRIBUTING.md) · [Scientific scope](#scientific-scope) · [MIT license](LICENSE)

NaturalScienceWorld is an early, bilingual hyperbook about dimensions, scales, and the theories we use to describe nature. Move from a theory map to an explanation, change a toy model's parameters, and inspect the questions that remain open.

**Alpha · `v0.1.0-alpha.1`** — a learning and exploration prototype. The dimension visualization uses project-defined formulas; it is not a physics solver or experimental evidence. Project hypotheses remain explicitly unverified.

![Theory Map showing scientific status labels and a selected theory](docs/media/theory-map.jpg)

## Take a one-minute tour

1. **Find a theory.** Filter the map by spacetime, quantum theory, information, cosmology, or hypotheses. Select a node to inspect its summary and scientific status.
2. **Explore a model.** Open the Dimension Lab and adjust its controls. Treat the changing graphics and scores as an illustration of the interface's model, not measured physical quantities.
3. **Read and compare.** Browse chapter previews, then search the Research Hub by keyword or scientific status. Follow linked sources and read what each one supports.
4. **Inspect the source.** Read the Markdown chapters and JSON registry, or run the deterministic command-line coverage example.

The interface supports Chinese and English, with desktop and mobile layouts. It runs locally without an API key; the current lab does not call a remote model service.

| Dimension Lab · illustrative toy model | Research Hub · linked sources |
| --- | --- |
| ![Dimension Lab with visible toy-model notice and adjustable controls](docs/media/dimension-lab.jpg) | ![Research Hub with theory status, source roles, and evidence limits](docs/media/research-hub.jpg) |

<details>
<summary>Chapter preview and mobile view</summary>

![Hyperbook chapter preview with scope notice and source links](docs/media/hyperbook.jpg)

<img src="docs/media/mobile.jpg" alt="Portrait mobile theory map with navigation and selected theory details" width="260">

</details>

## Run locally

Install Node.js 22 or newer and npm, then:

```bash
git clone https://github.com/eust-w/NaturalScienceWorld.git
cd NaturalScienceWorld
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`.

| Command | Purpose |
| --- | --- |
| `npm run check` | Run tests, validate the registry, type-check TypeScript, and build the app |
| `npm run validate:registry` | Check required registry fields and allowed status values |
| `npm run demo:dimensions` | Print a deterministic toy score for registry coverage |
| `npm run build` | Build the static app into `theory-lab/dist/` |
| `npm run preview` | Serve the production build locally |

`validate:registry` checks data structure; it does not validate scientific truth. The package is marked `private` to avoid accidental npm publication; the repository's license is MIT.

## Three connected tracks

| Track | What is here now | Where to contribute |
| --- | --- | --- |
| [Hyperbook](hyperbook/) | Markdown chapter drafts, a bibliography, and hypothesis templates | Explanations, references, translations |
| [Theory Lab](theory-lab/) | A theory map, parameterized toy visualization, chapter previews, and searchable theory cards | Accessible interactions and explainable demos |
| [Research Hub](research-hub/) | Ten theory entries, representative source links, and a deterministic CLI example | Source metadata, reproducibility, explicit limitations |

The web interface currently contains nine theory cards. It imports source citations from the ten-entry JSON registry through explicit ID mappings; bilingual summaries and other display metadata remain separately maintained. Named `demo_hooks` are ideas for future demonstrations, not a catalog of implemented simulators.

## Scientific scope

| Label | Meaning in this project |
| --- | --- |
| `established` | A theory with strong empirical support within its domain of applicability |
| `active-research` | An unresolved research area; a label does not imply a confirmed solution |
| `working-model` | A project-local organizing or explanatory model |
| `speculative` | An unverified hypothesis or analogy requiring formalization and tests |

The Observer Information Frame is a project-local organizing model. Dimensional Resonance is a speculative seed with no confirming evidence. Neither is presented as a discovery. Relations in the map are curated navigation aids, not a formal derivation graph.

Eight registry entries have a representative source link; seven are visible in the web interface. The two project-local entries have none. Each source is labeled as educational background, theoretical background, or empirical evidence, with a note on its scope. These links are a starting bibliography, not a full evidence review or an independent replication.

Read the [scientific contribution policy](CONTRIBUTING.md#scientific-contributions) and [bibliography](hyperbook/references/references.bib). The chapter previews are not a completed textbook or an independently reviewed scientific publication.

## Help shape the next release

- **Source-backed explanations:** expand a theory entry's references and explain exactly which claim each source supports.
- **One real, small demo:** implement a documented oscillator, phase-space orbit, or two-state example with known limiting cases.
- **One source of theory data:** build on the citation mappings to unify bilingual summaries and other duplicate metadata.
- **Accessible exploration:** improve keyboard navigation, screen-reader descriptions, and narrow-screen reading.
- **Reproducible chapters:** connect the Markdown sources to the reader, with visible citations and versioned examples.

See [contribution guidance](CONTRIBUTING.md) for small starting tasks. Improvements to clarity and scientific boundaries are as valuable as new features.

## License and credits

Project code and original documentation are available under the [MIT license](LICENSE). Dependencies retain their own licenses; see [third-party notices](THIRD_PARTY_NOTICES.md). Scientific references remain the work of their respective authors and are cited, not relicensed.

[Launch notes](docs/launch/README.md) · [Security](SECURITY.md) · [Community guidelines](CODE_OF_CONDUCT.md)
