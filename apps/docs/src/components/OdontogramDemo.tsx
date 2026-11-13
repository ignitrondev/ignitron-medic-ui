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

const toolbarLabel =
  'grid min-h-[60px] grid-cols-[auto_1fr] items-center gap-3 border-r border-line px-4 max-desktop:border-r-0 max-desktop:border-b';
const toolbarCaption =
  'font-mono text-[8px] leading-natural font-medium tracking-[0.08em] text-dim uppercase';
const toolbarSelect =
  'min-w-0 border-0 bg-space font-mono text-[10px] leading-natural font-medium text-ink-soft uppercase outline-0';

// The package CSS lives in `@layer ignitron`, which global.css orders below `utilities`,
// so plain utilities override it without `!`.
const odontogramTheme = [
  'rounded-none font-sans',
  '[--ignitron-bg:var(--color-surface)]',
  '[--ignitron-surface:var(--color-raised)]',
  '[--ignitron-text:var(--color-ink)]',
  '[--ignitron-muted:var(--color-dim)]',
  '[--ignitron-border:var(--color-line)]',
  '[--ignitron-focus:var(--color-ink)]',
  '[--ignitron-tooth-border:var(--color-faint)]',
  '[--ignitron-tooth-bg-start:var(--color-tooth-start)]',
  '[--ignitron-tooth-bg-end:var(--color-tooth-end)]',
  String.raw`[&_.ignitron-odontogram\_\_conditions_button]:rounded-[2px]`,
  String.raw`[&_.ignitron-odontogram\_\_meta_span]:rounded-[2px]`,
  String.raw`[&_.ignitron-odontogram\_\_legend_i]:rounded-[2px]`,
].join(' ');

export function OdontogramDemo() {
  const [value, setValue] = useState<OdontogramValue>(initialValue);
  const [numberingSystem, setNumberingSystem] = useState<ToothNumberingSystem>('FDI');
  const [dentition, setDentition] = useState<Dentition>('PERMANENT');
  const [mode, setMode] = useState<OdontogramMode>('edit');

  return (
    <div className="w-full border border-line-strong bg-space">
      <div
        className="grid grid-cols-[repeat(3,minmax(135px,1fr))_auto] border-b border-line max-wide:grid-cols-3 max-desktop:grid-cols-1"
        aria-label="Odontogram demo controls"
      >
        <label className={toolbarLabel}>
          <span className={toolbarCaption}>Numbering</span>
          <select
            className={toolbarSelect}
            value={numberingSystem}
            onChange={(event) => setNumberingSystem(event.target.value as ToothNumberingSystem)}
          >
            <option value="FDI">FDI</option>
            <option value="UNIVERSAL">Universal</option>
            <option value="PALMER">Palmer</option>
          </select>
        </label>

        <label className={toolbarLabel}>
          <span className={toolbarCaption}>Dentition</span>
          <select
            className={toolbarSelect}
            value={dentition}
            onChange={(event) => setDentition(event.target.value as Dentition)}
          >
            <option value="PERMANENT">Permanent</option>
            <option value="PRIMARY">Primary</option>
            <option value="MIXED">Mixed</option>
          </select>
        </label>

        <label className={toolbarLabel}>
          <span className={toolbarCaption}>Mode</span>
          <select
            className={toolbarSelect}
            value={mode}
            onChange={(event) => setMode(event.target.value as OdontogramMode)}
          >
            <option value="edit">Edit</option>
            <option value="readOnly">Read only</option>
            <option value="print">Print</option>
          </select>
        </label>

        <button
          className="cursor-pointer border-0 bg-raised px-[18px] font-mono text-[9px] leading-natural font-medium text-muted uppercase hover:bg-ink hover:text-space max-wide:col-span-3 max-wide:min-h-12 max-wide:border-t max-wide:border-line max-desktop:col-span-1 max-desktop:border-t-0"
          type="button"
          onClick={() => setValue(createEmptyOdontogramValue())}
        >
          Clear findings
        </button>
      </div>

      <div className="p-6 max-desktop:p-2.5">
        <Odontogram
          className={odontogramTheme}
          value={value}
          onChange={setValue}
          conditions={conditions}
          numberingSystem={numberingSystem}
          dentition={dentition}
          mode={mode}
        />
      </div>

      <div className="grid h-[280px] min-h-0 grid-cols-[160px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden border-t border-line bg-code max-desktop:h-[320px] max-desktop:grid-cols-1 max-desktop:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex flex-col gap-[7px] border-r border-line p-5 font-mono text-[8px] leading-natural font-medium tracking-[0.1em] text-faint max-desktop:flex-row max-desktop:justify-between max-desktop:border-r-0 max-desktop:border-b">
          <span>LIVE VALUE</span>
          <span className="tracking-normal text-muted">{value.findings.length} findings</span>
        </div>
        <pre className="m-0 min-h-0 min-w-0 overflow-auto px-6 py-5 text-[11px] leading-[1.65] text-code-text">
          <code>{JSON.stringify(value, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
