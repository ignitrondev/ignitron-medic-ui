---
"@ignitrondev/odontogram": minor
---

Ship the stylesheet inside `@layer ignitron` (ordered `theme, base, ignitron, components, utilities`) so utility classes such as Tailwind's can override the chart without `!important`. Also expose `--ignitron-tooth-border`, `--ignitron-tooth-bg-start`, and `--ignitron-tooth-bg-end` CSS variables so hosts can theme the tooth outline and surface (for example in dark mode). Defaults are unchanged.

Note for hosts with their own unlayered global CSS (for example a reset that styles `h2`, `button` or `fieldset`): unlayered rules now take precedence over the chart's styles. Put such rules in a layer declared before `ignitron`, or override with the documented `--ignitron-*` variables.
