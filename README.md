# LighterPack

LighterPack is a web app for building, weighing, previewing, and sharing outdoor gear lists.

It is designed for backpacking and other trips where small weight choices matter. You can group items into categories, track quantities and weights, mark worn or consumable items, add notes with Markdown, and share a read-only version of a list.

Current version: 2.1.0

## What You Can Do

- Build multiple gear lists and switch between them.
- Organize gear by category.
- Track item name, description, weight, quantity, price, image, link, worn state, consumable state, and star markers.
- Show summary weights by total, consumable, worn, and base weight.
- Export lists to CSV or detailed JSON.
- Copy a list.
- Pick category colors with the visual selector or by entering an HTML color code.
- Use light mode, dark mode, or the system theme.

## Local Development

### Prerequisites

- Node.js and npm.
- MongoDB, running locally or reachable through the configured connection string.

This project still uses older frontend build tooling. On newer Node.js versions, webpack may require `NODE_OPTIONS=--openssl-legacy-provider`.

### Setup

```bash
git clone https://github.com/galenmaly/lighterpack.git
cd lighterpack
npm install
```

Start MongoDB before starting the app. The default config expects:

```text
localhost/lighterpack
```

Then run:

```bash
npm run dev
```

In development, the Express app listens on port `3000` and the webpack dev server listens on port `8080`. Open:

```text
http://localhost:8080
```

### Build

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

On PowerShell:

```powershell
$env:NODE_OPTIONS='--openssl-legacy-provider'; npm run build
```

### Tests

End-to-end tests use Playwright:

```bash
npx playwright test
```

If browser binaries are missing, install them first:

```bash
npx playwright install
```

## Configuration

Default configuration lives in `config/default.json`.

Common settings:

- `environment`: `development` or `production`.
- `port`: Express app port.
- `devServerPort`: webpack dev server port.
- `databaseUrl`: MongoDB connection string.
- `deployUrl` and `publicUrl`: public URLs used for shared and embedded list links.
- `imgurClientID`: enables image upload support when configured.
- `mailgunDomain`, `mailgunBaseURL`, and `mailgunAPIKey`: enable email flows.
- `moderators`: usernames allowed to use moderation tools.

Use local config overrides rather than committing secrets.

## Project Layout

- `client/`: Vue 2 app, shared data types, styling, chart rendering, and browser utilities.
- `server/`: Express endpoints, authentication, moderation, shared-list rendering, and persistence helpers.
- `templates/`: Mustache templates for shared and embedded list pages.
- `public/`: static assets and generated build output.
- `test/`: Playwright end-to-end tests and load-testing helpers.
- `config/`: runtime configuration.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for the 2.1.0 end-user change summary.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

LighterPack is licensed under GPL-2.0. See [LICENSE](LICENSE).
