# Ignitron Clinical UI

Clinical UI infrastructure for healthcare developers. This repository contains reusable, backend-agnostic React components with explicit data contracts and testable clinical states.

The first package is **Ignitron Odontogram**.

> Status: early development. The package has not completed clinical validation and must not be treated as a medical device or a substitute for clinical review.

## Repository structure

```text
apps/
├── docs/          Branded Astro documentation and interactive examples
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

The documentation is a static Astro site. For Cloudflare Pages, use `pnpm docs:build`
as the build command and `apps/docs/dist` as the output directory.

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

The initial package version is `0.1.0-alpha.0`. Releases use Changesets, semantic
versioning, and npm trusted publishing. See [CONTRIBUTING.md](./CONTRIBUTING.md)
and [docs/releasing.md](./docs/releasing.md).

## License

The open-source package is licensed under the [Apache License 2.0](./LICENSE).
