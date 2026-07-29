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

See the repository Storybook for interactive examples.
