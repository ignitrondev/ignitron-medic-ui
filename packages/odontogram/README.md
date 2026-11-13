# @ignitrondev/odontogram

Configurable React odontogram with a framework-independent clinical data model.

## Alpha capabilities

- Canonical tooth identifiers independent of display notation.
- FDI, Universal, and readable Palmer labels.
- Primary, permanent, and mixed dentition.
- Configurable whole-tooth conditions.
- Controlled value and domain change events.
- Keyboard-operable tooth buttons.
- Edit, read-only, and print modes.
- No network requests or hidden telemetry.

Surface-level interaction and clinical validation are not complete.

## Install

```bash
pnpm add @ignitrondev/odontogram
```

Import the stylesheet once in the consuming application:

```ts
import '@ignitrondev/odontogram/styles.css';
```

Domain helpers can be imported without loading the React client entry point:

```ts
import { formatToothNumber, validateOdontogramValue } from '@ignitrondev/odontogram/core';
```

See the repository documentation site for interactive examples.

## Styling

The stylesheet ships inside a CSS cascade layer named `ignitron`, so your own styles can
override the chart without `!important`.

### Theme variables

Set these on the chart (via `className` or any ancestor selector) to restyle it:

| Variable                    | Default   | Used for                           |
| --------------------------- | --------- | ---------------------------------- |
| `--ignitron-bg`             | `#ffffff` | Chart background                   |
| `--ignitron-surface`        | `#f8fafc` | Condition bar and legend           |
| `--ignitron-text`           | `#172033` | Primary text                       |
| `--ignitron-muted`          | `#64748b` | Secondary text and tooth numbers   |
| `--ignitron-border`         | `#dbe3ee` | Borders and dividers               |
| `--ignitron-focus`          | `#2563eb` | Focus ring and tooth hover outline |
| `--ignitron-tooth-border`   | `#94a3b8` | Tooth outline                      |
| `--ignitron-tooth-bg-start` | `#fff`    | Tooth surface gradient start       |
| `--ignitron-tooth-bg-end`   | `#eef2f7` | Tooth surface gradient end         |

### Tailwind CSS v4

Declare the layer order before importing Tailwind so that `ignitron` sits above Preflight
and below utilities:

```css
@layer theme, base, ignitron, components, utilities;
@import 'tailwindcss';
```

Utilities then override the chart directly, for example
`<Odontogram className="rounded-none [--ignitron-bg:#09090b]" />`. Without
this line the result depends on stylesheet load order, and utilities may need `!` to win.

### Unlayered global CSS

Unlayered rules always take precedence over layered ones. A global reset that styles
elements such as `h2`, `button`, `fieldset` or `legend` outside any layer (Bootstrap
Reboot, Tailwind v3 Preflight) will therefore also apply inside the chart. Either move
those rules into a layer declared before `ignitron`, or restore the affected properties
with a selector scoped to `.ignitron-odontogram`.

## Status and license

This package is an alpha release and has not completed clinical validation. It is
licensed under the Apache License 2.0.
