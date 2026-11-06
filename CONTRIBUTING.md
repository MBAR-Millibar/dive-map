# Contributing

Thank you for helping improve the Millibar Dive Map.

By contributing, you agree that your contribution is released under the [Apache-2.0 licence](LICENSE), and you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

> **Security issues are not reported in issues.** See [SECURITY.md](SECURITY.md).

## What to contribute

- Bug fixes: a country drawn in the wrong place, a missing dot, a tooltip or zoom problem
- Missing or wrong countries in `COUNTRY_CODES`
- Fixes to the Alpine or React adapters
- Clearer README examples, typos and broken links

New options and larger changes: open a [feature request](https://github.com/MBAR-Millibar/dive-map/issues/new?template=feature.yml) first, so the change can be discussed before anyone writes code. Both app.millibar.io and map.millibar.io draw this map, so a change has to work for both.

## Setup

```bash
git clone https://github.com/MBAR-Millibar/dive-map.git
cd dive-map
npm ci
```

The package is plain ESM JavaScript with JSDoc types. There is no build step: `src/` is what projects import.

To try a change in a project, install your branch's tarball or link the folder (`npm install ../dive-map`), then load the map as in the [README](README.md).

## How to propose a change

1. Fork the repository and create a branch (`fix/…`, `add/…`, `docs/…`).
2. Make the change. Keep the core (`src/core.js`) framework-agnostic: Alpine code goes in `src/alpine.js`, React code in `src/react.js`.
3. If you changed an option, a prop or a CSS variable, update the README.
4. Run the checks (below) and open a pull request.

## Code style

- 4 spaces, single quotes, semicolons, trailing commas in multi-line lists (2 spaces in JSON and YAML).
- JSDoc types on exported functions and options.
- Comments say why, not what.
- British English in docs and comments (`colour`, `behaviour`).

## Commit messages

One line, starting with the kind of change, then what it does from the user's point of view. Put new options or variables in brackets:

```text
add: Want to dive layer (wishlist, editing, onWishlistChange, --mbar-dive-map-wish)
change: countries get lighter on hover instead of fading
fix: …
docs: …
```

## Checks

CI runs on every pull request:

- **Syntax**: every file in `src/` and `scripts/` parses (`node --check`).
- **Imports**: the core, Alpine and countries entry points load in Node without a DOM. (`react` is an optional peer dependency and isn't installed in CI.)
- **Regions**: `src/map-regions.js` matches the installed jsVectorMap. After bumping `jsvectormap`, run `npm run regions` and commit the result.

Run them locally:

```bash
for f in src/*.js scripts/*.mjs; do node --check "$f"; done
npm run regions && git diff --exit-code src/map-regions.js
```

## Releases

Maintainers release by bumping `version` in `package.json` and the install URL in the README, tagging `vX.Y.Z` on `main`, and publishing a GitHub release that lists the changes. Projects pin the tag's tarball, so nothing changes for them until they bump it.
