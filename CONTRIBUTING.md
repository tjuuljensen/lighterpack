# Contributing to LighterPack

Thanks for helping improve LighterPack. This guide describes how to make useful, reviewable contributions to the project.

## How to Start

1. Open an issue for substantial changes before writing a large patch.
2. Keep pull requests focused on one problem or feature.
3. Prefer small, reviewable changes over broad rewrites.
4. Follow the existing Vue 2, Express, SCSS, and data-model patterns unless the change explicitly needs a new approach.

Bug fixes, usability improvements, accessibility improvements, documentation updates, and test coverage are all welcome.

## Development Setup

Install dependencies:

```bash
npm install
```

Start MongoDB, then run the local app:

```bash
npm run dev
```

Open:

```text
http://localhost:8080
```

On newer Node.js versions, use the legacy OpenSSL provider for webpack commands:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

PowerShell:

```powershell
$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build
```

## Quality Bar

Before opening a pull request:

- Run the build for frontend changes.
- Run relevant Playwright tests for UI or workflow changes.
- Add or update tests when behavior changes.
- Manually verify the affected workflow in both edit and shared or preview views when relevant.
- Check light and dark mode when touching UI styling.
- Avoid committing generated build artifacts unless the release process specifically requires them.
- Do not commit secrets, real user data, database dumps, private keys, API keys, or personal access tokens.

Useful commands:

```bash
npm run build
npx playwright test
```

## Code Style

- Match the surrounding code style.
- Keep component changes scoped to the feature or bug being fixed.
- Prefer existing helpers and data types over duplicating logic.
- Keep user-facing text clear and practical.
- Avoid unrelated formatting churn.
- Use accessible labels, meaningful link text, and keyboard-friendly interactions for new UI.
- Make dark mode and responsive behavior part of UI review, not an afterthought.

## Data and Compatibility

LighterPack stores user libraries in MongoDB and has long-lived saved list data. Treat data compatibility as a core requirement.

When changing saved data shapes:

- Preserve loading of older libraries.
- Add migration logic in the data model when needed.
- Make exports and imports explicit about the data they include.
- Verify shared links and embedded lists still render correctly.

## Pull Request Checklist

Include the following in the pull request description:

- What changed.
- Why it changed.
- How it was tested.
- Screenshots or short screen recordings for UI changes.
- Any known limitations or follow-up work.

If the change affects users directly, describe the change in user terms, not only implementation terms.

## Security and Privacy

Report security issues privately to the project maintainer rather than opening a public issue. Include enough detail to reproduce the problem and assess severity.

When working on authentication, sharing, exports, images, email, or moderation:

- Be careful with authorization checks.
- Avoid leaking private list data through shared routes.
- Validate and escape user-provided content.
- Prefer least-privilege configuration and environment-specific secrets.

## Maintenance Notes

This codebase includes older dependencies and build tooling. Modernization is welcome, but dependency upgrades should be isolated, tested, and described clearly. Do not mix large dependency upgrades with unrelated feature work.
