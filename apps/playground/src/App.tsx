import { useState } from 'react';
import {
  Odontogram,
  createEmptyOdontogramValue,
} from '@ignitrondev/odontogram';
import type {
  Dentition,
  OdontogramCondition,
  OdontogramMode,
  OdontogramValue,
  ToothNumberingSystem,
} from '@ignitrondev/odontogram';

const conditions: OdontogramCondition[] = [
  { code: 'CARIES', label: 'Caries', symbol: 'C', color: '#dc2626' },
  { code: 'FILLED', label: 'Filled', symbol: 'F', color: '#2563eb' },
  { code: 'MISSING', label: 'Missing', symbol: 'X', color: '#475569' },
  { code: 'ROOT_REMAINS', label: 'Root remains', symbol: 'R', color: '#9333ea' },
];

export function App() {
  const [value, setValue] = useState<OdontogramValue>(createEmptyOdontogramValue());
  const [numberingSystem, setNumberingSystem] = useState<ToothNumberingSystem>('FDI');
  const [dentition, setDentition] = useState<Dentition>('PERMANENT');
  const [mode, setMode] = useState<OdontogramMode>('edit');

  return (
    <main>
      <header className="page-header">
        <div>
          <p>IGNITRON CLINICAL UI · PLAYGROUND</p>
          <h1>Odontogram integration</h1>
          <span>Controlled React component with visible JSON output.</span>
        </div>
        <a href="https://github.com/ignitrondev" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <section className="controls" aria-label="Odontogram configuration">
        <label>Numbering
          <select value={numberingSystem} onChange={(event) => setNumberingSystem(event.target.value as ToothNumberingSystem)}>
            <option value="FDI">FDI</option><option value="UNIVERSAL">Universal</option><option value="PALMER">Palmer</option>
          </select>
        </label>
        <label>Dentition
          <select value={dentition} onChange={(event) => setDentition(event.target.value as Dentition)}>
            <option value="PERMANENT">Permanent</option><option value="PRIMARY">Primary</option><option value="MIXED">Mixed</option>
          </select>
        </label>
        <label>Mode
          <select value={mode} onChange={(event) => setMode(event.target.value as OdontogramMode)}>
            <option value="edit">Edit</option><option value="readOnly">Read-only</option><option value="print">Print</option>
          </select>
        </label>
        <button type="button" onClick={() => setValue(createEmptyOdontogramValue())}>Clear findings</button>
      </section>

      <Odontogram
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        conditions={conditions}
        numberingSystem={numberingSystem}
        dentition={dentition}
        mode={mode}
      />

      <section className="json-panel">
        <div><span>VALUE OUTPUT</span><b>{value.findings.length} finding{value.findings.length === 1 ? '' : 's'}</b></div>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </section>
    </main>
  );
}
