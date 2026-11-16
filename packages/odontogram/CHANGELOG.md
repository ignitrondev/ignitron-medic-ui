# @ignitrondev/odontogram

## 0.1.0-alpha.3

### Patch Changes

- d8a561e: Document the `ignitron` cascade layer, the `--ignitron-*` theme variables, and the layer order Tailwind CSS v4 hosts need in the README.

## 0.1.0-alpha.2

### Minor Changes

- b642d97: Ship the stylesheet inside `@layer ignitron` (ordered `theme, base, ignitron, components, utilities`) so utility classes such as Tailwind's can override the chart without `!important`. Also expose `--ignitron-tooth-border`, `--ignitron-tooth-bg-start`, and `--ignitron-tooth-bg-end` CSS variables so hosts can theme the tooth outline and surface (for example in dark mode). Defaults are unchanged.

  Note for hosts with their own unlayered global CSS (for example a reset that styles `h2`, `button` or `fieldset`): unlayered rules now take precedence over the chart's styles. Put such rules in a layer declared before `ignitron`, or override with the documented `--ignitron-*` variables.

### Patch Changes

- a17b6d2: Set heading font weights and the condition legend padding explicitly so the chart renders the same when the host app uses a CSS reset such as Tailwind's Preflight.

## 0.1.0-alpha.1

### Patch Changes

- Publish releases through npm Trusted Publishing with GitHub Actions provenance.
