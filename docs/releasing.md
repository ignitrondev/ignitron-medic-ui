# Publishing releases

`@ignitrondev/odontogram` is published as a public scoped package on npm. GitHub
Actions uses npm trusted publishing (OIDC), so the repository does not store a
long-lived npm write token.

## One-time npm bootstrap

The first release must be published by an authorized npm maintainer before npm can
attach a trusted publisher to the package.

1. Create or join the npm organization named `ignitrondev` and enable two-factor
   authentication on the maintainer account.
2. Authenticate locally with `npm login`.
3. From the repository root, run every quality check:

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   pnpm build
   npm pack ./packages/odontogram --dry-run
   ```

4. Publish the initial prerelease under the `alpha` dist-tag:

   ```bash
   npm publish ./packages/odontogram --access public --tag alpha
   ```

5. In the package settings on npmjs.com, add a GitHub Actions trusted publisher:

   - Organization or user: `ignitrondev`
   - Repository: `ignitron-medic-ui`
   - Workflow filename: `publish.yml`
   - Allowed action: `npm publish`

## Subsequent releases

Releases are driven by `.github/workflows/publish.yml` using `changesets/action`.
The workflow must keep the filename `publish.yml` because the npm trusted publisher
is registered for it.

1. In your feature PR, run `pnpm changeset` and commit the generated file.
2. Merge the PR into `main`. The workflow runs the quality checks and opens (or updates)
   a **chore(release): version packages** PR that bumps the version and changelog.
3. Review and merge the version PR. The workflow then runs
   `scripts/publish-odontogram.sh`, which publishes to npm and pushes the
   `odontogram-v<version>` git tag.

The publish script skips versions that already exist on npm, so re-running the
workflow is safe. Prerelease versions publish under their first prerelease
identifier (`alpha`, `beta`, or `rc`); stable versions publish under `latest`.

### Manual release with a git tag

Tags are scoped to the odontogram package (`odontogram-v<version>`). Pushing one is a
fallback when the automatic run failed or you need a quick hotfix:

```bash
git tag odontogram-v0.1.0-alpha.2
git push origin odontogram-v0.1.0-alpha.2
```

The workflow rejects a tag that does not match the version in
`packages/odontogram/package.json`, or that points to a commit not on `main`. The tag
itself must be created after the version bump has been merged to `main`.

### Repository settings required

- Settings → Actions → General → Workflow permissions: enable
  **Allow GitHub Actions to create and approve pull requests**.
- If `main` is protected, the version PR must be able to pass the required checks.
  PRs created with `GITHUB_TOKEN` do not trigger the CI workflow on their own, so
  either close and reopen the PR to run CI, or use a GitHub App token instead.

### Leaving prerelease mode

The repo is in Changesets prerelease mode (`.changeset/pre.json`, tag `alpha`). To
move to a stable release, run `pnpm changeset pre exit` and commit the result before
the next version PR.
