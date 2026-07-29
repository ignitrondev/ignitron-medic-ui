# Ignitron Clinical UI

Clinical UI infrastructure for healthcare developers. This repository contains reusable, backend-agnostic React components with explicit data contracts and testable clinical states.

The first package is **Ignitron Odontogram**.

> Status: early development. The package has not completed clinical validation and must not be treated as a medical device or a substitute for clinical review.

## Repository structure

```text
apps/
├── docs/          Storybook documentation and component states
└── playground/    Integration playground with visible JSON output

packages/
└── odontogram/    Framework-independent domain core and React renderer
```

## Requirements

- Node.js 22 or newer
- pnpm 11

## Development

```bash
pnpm install
pnpm docs
pnpm playground
```

Run all quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Package API

```tsx
import { Odontogram, createEmptyOdontogramValue } from '@ignitrondev/odontogram';
import '@ignitrondev/odontogram/styles.css';

const [value, setValue] = useState(createEmptyOdontogramValue());

<Odontogram
  value={value}
  onChange={setValue}
  numberingSystem="FDI"
  dentition="PERMANENT"
  conditions={conditions}
/>
```

The package performs no network requests. Authentication, authorization, persistence, audit storage, and digital signatures remain application responsibilities.

## Release status

The initial package version is `0.1.0-alpha.0`. Releases use Changesets and semantic versioning. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Currently `UNLICENSED` while the open-core boundary and commercial terms are being decided. Do not publish the npm package until a license has been selected.
