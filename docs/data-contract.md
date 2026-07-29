# Odontogram data contract

The alpha contract stores structured findings and a schema version:

```ts
interface OdontogramValue {
  schemaVersion: 1;
  findings: ToothFinding[];
}

interface ToothFinding {
  id: string;
  toothId: CanonicalToothId;
  conditionCode: string;
  surface?: ToothSurface;
  note?: string;
}
```

## Current scope

- Whole-tooth findings can be edited by the renderer.
- Surface types are represented in the contract but surface interaction is not implemented yet.
- Multiple condition codes may coexist on one tooth.
- Numbering system and dentition are renderer configuration, not duplicated inside the stored value.

## Migration rule

`schemaVersion` is mandatory. A future contract change that changes meaning must ship an explicit, tested migration function. Styling changes do not require a schema migration.
