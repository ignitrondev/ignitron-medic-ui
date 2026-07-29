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

1. Add a Changeset with the package change.
2. Run `pnpm version-packages`, review the version and changelog, then commit them.
3. Create and push a tag matching the package version:

   ```bash
   git tag odontogram-v0.1.0-alpha.1
   git push origin odontogram-v0.1.0-alpha.1
   ```

The publish workflow rejects a tag that does not match the version in
`packages/odontogram/package.json`. Prerelease versions publish under their first
prerelease identifier (`alpha`, `beta`, or `rc`); stable versions publish under
`latest`.
