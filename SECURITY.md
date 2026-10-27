# Security policy

NaturalScienceWorld is an Alpha static web application and local development project. Security fixes are applied to the current default branch; older snapshots are not separately maintained.

## Reporting a vulnerability

Use the repository's **Security → Report a vulnerability** option when available. If private reporting is unavailable, open a minimal issue asking for a private reporting channel without including exploit details, credentials, or private data. Do not post a working exploit or sensitive material in a public issue.

Include the affected revision, impact, reproduction conditions, and a minimal example through the private channel. Maintainers will assess reports as capacity allows; this project does not promise a response-time SLA or a bounty.

For scientific inaccuracies that do not create a security issue, use the scientific correction issue template.

## Local use

- Development and preview servers bind to loopback by default. Only expose a server deliberately and with suitable access controls.
- The current lab requires no API credentials. Future integrations must use environment variables and must not expose secrets in client bundles.
- Do not place private research data or credentials in a public issue, recording, screenshot, or repository file.
- Review dependency updates with `npm audit` and run `npm run check` before adopting them.
