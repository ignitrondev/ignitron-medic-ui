import { useState } from 'react';
import {
  Odontogram,
  createEmptyOdontogramValue,
  createToothId,
} from '@ignitrondev/odontogram';
import type {
  Dentition,
  OdontogramCondition,
  OdontogramMode,
  OdontogramValue,
  ToothNumberingSystem,
} from '@ignitrondev/odontogram';

const conditions: OdontogramCondition[] = [
  { code: 'CARIES', label: 'Caries', symbol: 'C', color: '#fb7185' },
  { code: 'FILLED', label: 'Filled', symbol: 'F', color: '#60a5fa' },
  { code: 'MISSING', label: 'Missing', symbol: 'X', color: '#a1a1aa' },
  { code: 'ROOT_REMAINS', label: 'Root remains', symbol: 'R', color: '#c084fc' },
];

const initialValue: OdontogramValue = {
  schemaVersion: 1,
  findings: [
    {
      id: 'finding-16-caries',
      toothId: createToothId('PERMANENT', 'MAXILLARY', 'RIGHT', 6),
      conditionCode: 'CARIES',
    },
    {
      id: 'finding-24-filled',
      toothId: createToothId('PERMANENT', 'MAXILLARY', 'LEFT', 4),
      conditionCode: 'FILLED',
    },
    {
      id: 'finding-36-missing',
      toothId: createToothId('PERMANENT', 'MANDIBULAR', 'LEFT', 6),
      conditionCode: 'MISSING',
    },
  ],
};

export function OdontogramDemo() {
  const [value, setValue] = useState<OdontogramValue>(initialValue);
  const [numberingSystem, setNumberingSystem] = useState<ToothNumberingSystem>('FDI');
  const [dentition, setDentition] = useState<Dentition>('PERMANENT');
  const [mode, setMode] = useState<OdontogramMode>('edit');

  return (
    <div className="demo-shell">
      <div className="demo-toolbar" aria-label="Odontogram demo controls">
        <label>
          <span>Numbering</span>
          <select
            value={numberingSystem}
            onChange={(event) => setNumberingSystem(event.target.value as ToothNumberingSystem)}
          >
            <option value="FDI">FDI</option>
            <option value="UNIVERSAL">Universal</option>
            <option value="PALMER">Palmer</option>
          </select>
        </label>

        <label>
          <span>Dentition</span>
          <select
            value={dentition}
            onChange={(event) => setDentition(event.target.value as Dentition)}
          >
            <option value="PERMANENT">Permanent</option>
            <option value="PRIMARY">Primary</option>
            <option value="MIXED">Mixed</option>
          </select>
        </label>

        <label>
          <span>Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as OdontogramMode)}
          >
            <option value="edit">Edit</option>
            <option value="readOnly">Read only</option>
            <option value="print">Print</option>
          </select>
        </label>

        <button type="button" onClick={() => setValue(createEmptyOdontogramValue())}>
          Clear findings
        </button>
      </div>

      <div className="docs-live-demo">
        <Odontogram
          className="docs-odontogram"
          value={value}
          onChange={setValue}
          conditions={conditions}
          numberingSystem={numberingSystem}
          dentition={dentition}
          mode={mode}
        />
      </div>

      <div className="demo-output">
        <div>
          <span>LIVE VALUE</span>
          <span>{value.findings.length} findings</span>
        </div>
        <pre><code>{JSON.stringify(value, null, 2)}</code></pre>
      </div>
    </div>
  );
}
