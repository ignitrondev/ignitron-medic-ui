# Contributing

## Workflow

1. Create or update tests for the domain behavior.
2. Add interactive documentation examples for every new visual or interaction state.
3. Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.
4. Add a Changeset for a change that affects the public package.
5. Request both engineering and domain review for clinical behavior changes.

## Clinical changes

A pull request that changes numbering, tooth identity, finding semantics, print output, or correction behavior must document:

- The workflow being supported.
- The data contract impact.
- The clinical reviewer or pending review status.
- Migration behavior for existing values.

Do not silently reinterpret stored clinical data.

## Commit convention

Use concise Conventional Commit messages such as:

```text
feat(odontogram): add whole-tooth findings
fix(numbering): correct Universal primary mapping
docs: document read-only integration
```

## Releases

Public package releases are published to npm from a signed Git tag through GitHub
Actions. See [docs/releasing.md](./docs/releasing.md) for the bootstrap and release
checklist. Never add an npm write token to the repository.
