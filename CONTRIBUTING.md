# Contributing to NaturalScienceWorld

Thank you for helping make scientific ideas easier to inspect and understand. Contributions can be explanations, references, translations, accessible interactions, or small executable demonstrations.

## Start small

Choose one concrete improvement. Open an issue before a new theory, substantial demo, or architecture change so its scope and evidence requirements can be discussed. Corrections and small documentation fixes can go directly to a pull request.

Good first contributions:

- Add one primary source and its scope to a registry entry.
- Correct a translation while preserving the theory's scientific status.
- Describe one diagram for screen-reader users.
- Reproduce a UI problem on a small viewport and provide exact steps.
- Document a demo's units, assumptions, formula, and known failure cases.

## Local development

```bash
npm ci
npm run dev
```

Before submitting code:

```bash
npm run check
npm audit
git diff --check
```

After registry edits, run `npm run validate:registry`. For UI changes, check the affected interaction in both languages and at desktop and mobile widths. Add focused tests when a behavior or numerical calculation needs a regression check; a successful build alone is not evidence that a simulation is scientifically valid.

Keep changes within the relevant track:

- `hyperbook/`: explanations, chapter sources, bibliography, and narrative assets.
- `theory-lab/`: browser interactions and visual demonstrations.
- `research-hub/`: structured theory records, experiments, and publication preparation.

The UI imports source citations from the registry through explicit ID mappings; bilingual summaries and other display metadata remain separate. If a change affects both, update both or explicitly describe the remaining mismatch.

## Scientific contributions

1. Assign one of `established`, `active-research`, `working-model`, or `speculative` and explain the choice.
2. Cite primary papers, authoritative datasets, or original technical documentation. Include stable identifiers such as a DOI or arXiv ID where available.
3. Separate a source's findings from your interpretation and from project-local assumptions. State the regime where a model applies.
4. Describe limitations, unresolved questions, and what evidence could contradict the claim.
5. For numerical work, include equations, units, initial conditions, random seeds when relevant, and a reproducible command. Compare against a known solution or limiting case when possible.
6. Mark analogies and toy models visibly in the UI and documentation. Do not describe a decorative visualization or a project-defined score as a physical measurement.

New hypotheses belong in the [hypothesis template](research-hub/templates/hypothesis-template.md). A visual resemblance, code output, or successful registry validation is not empirical confirmation. Project-local hypotheses remain `speculative` until their status is justified through an appropriate scientific review process.

## Pull requests

Explain the user-visible change, scientific assumptions if relevant, and how you checked it. Include screenshots for visual changes and a source reference for new external claims. Keep unrelated changes out of the pull request.

Do not add credentials, personal data, private endpoints, or machine-specific paths. Keep generated builds, dependency directories, and large media files out of Git unless the maintainers explicitly choose to version them. See [SECURITY.md](SECURITY.md) for vulnerability reporting.

By submitting your original contribution, you agree that it can be distributed under this project's [MIT license](LICENSE). Identify material that belongs to someone else and preserve its license and attribution. Disclose meaningful AI assistance when it affects prose, code, or media; contributors remain responsible for checking accuracy and rights.

中文贡献欢迎。请保持证据等级、来源、适用范围和未验证内容的标注；不需要为了提交贡献而把中文讨论翻译成英文。
