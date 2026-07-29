'use client';

import { useId, useMemo, useState } from 'react';
import {
  formatToothNumber,
  getArchTeeth,
  getDentitionKinds,
  validateConditions,
  validateOdontogramValue,
} from '../core';
import type {
  CanonicalToothId,
  DentalArch,
  Dentition,
  OdontogramChangeEvent,
  OdontogramCondition,
  OdontogramMode,
  OdontogramValue,
  ToothDefinition,
  ToothNumberingSystem,
} from '../core';
import './odontogram.css';

export interface OdontogramProps {
  value: OdontogramValue;
  onChange?: (value: OdontogramValue, event: OdontogramChangeEvent) => void;
  conditions: OdontogramCondition[];
  numberingSystem?: ToothNumberingSystem;
  dentition?: Dentition;
  mode?: OdontogramMode;
  activeConditionCode?: string;
  onActiveConditionChange?: (conditionCode: string) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

interface ToothButtonProps {
  tooth: ToothDefinition;
  value: OdontogramValue;
  conditions: Map<string, OdontogramCondition>;
  numberingSystem: ToothNumberingSystem;
  activeConditionCode: string | undefined;
  readOnly: boolean;
  onToggle: (toothId: CanonicalToothId) => void;
}

function ToothButton({
  tooth,
  value,
  conditions,
  numberingSystem,
  activeConditionCode,
  readOnly,
  onToggle,
}: ToothButtonProps) {
  const toothNumber = formatToothNumber(tooth, numberingSystem);
  const findings = value.findings.filter((finding) => finding.toothId === tooth.id);
  const wholeToothFindings = findings.filter((finding) => finding.surface === undefined);
  const labels = findings.map((finding) => conditions.get(finding.conditionCode)?.label ?? finding.conditionCode);
  const symbols = wholeToothFindings
    .map((finding) => conditions.get(finding.conditionCode)?.symbol ?? '•')
    .join('');
  const primaryCondition = wholeToothFindings[0]
    ? conditions.get(wholeToothFindings[0].conditionCode)
    : undefined;
  const isActiveConditionApplied = wholeToothFindings.some(
    (finding) => finding.conditionCode === activeConditionCode,
  );
  const accessibleLabel = [
    `Tooth ${toothNumber}`,
    tooth.kind === 'PRIMARY' ? 'primary' : 'permanent',
    labels.length > 0 ? labels.join(', ') : 'no finding',
  ].join(', ');

  return (
    <button
      type="button"
      className="ignitron-odontogram__tooth"
      aria-label={accessibleLabel}
      aria-pressed={isActiveConditionApplied}
      disabled={readOnly}
      data-has-finding={findings.length > 0 ? 'true' : 'false'}
      onClick={() => onToggle(tooth.id)}
      style={
        primaryCondition?.color
          ? ({ '--ignitron-tooth-accent': primaryCondition.color } as React.CSSProperties)
          : undefined
      }
    >
      <span className="ignitron-odontogram__tooth-number">{toothNumber}</span>
      <span className="ignitron-odontogram__tooth-shape" aria-hidden="true">
        <span>{symbols}</span>
      </span>
    </button>
  );
}

export function Odontogram({
  value,
  onChange,
  conditions,
  numberingSystem = 'FDI',
  dentition = 'PERMANENT',
  mode = 'edit',
  activeConditionCode,
  onActiveConditionChange,
  className,
  id,
  ariaLabel = 'Interactive odontogram',
}: OdontogramProps) {
  const generatedId = useId();
  const rootId = id ?? `ignitron-odontogram-${generatedId.replaceAll(':', '')}`;
  const [internalConditionCode, setInternalConditionCode] = useState(conditions[0]?.code);
  const selectedConditionCode = activeConditionCode ?? internalConditionCode;
  const readOnly = mode !== 'edit';
  const conditionMap = useMemo(
    () => new Map(conditions.map((condition) => [condition.code, condition])),
    [conditions],
  );
  const validationErrors = [
    ...validateOdontogramValue(value),
    ...validateConditions(conditions),
  ];

  function selectCondition(conditionCode: string) {
    if (activeConditionCode === undefined) setInternalConditionCode(conditionCode);
    onActiveConditionChange?.(conditionCode);
  }

  function toggleFinding(toothId: CanonicalToothId) {
    if (readOnly || !selectedConditionCode || !onChange) return;

    const currentFinding = value.findings.find(
      (finding) =>
        finding.toothId === toothId &&
        finding.conditionCode === selectedConditionCode &&
        finding.surface === undefined,
    );

    if (currentFinding) {
      const nextValue: OdontogramValue = {
        ...value,
        findings: value.findings.filter((finding) => finding.id !== currentFinding.id),
      };
      onChange(nextValue, { type: 'finding.removed', finding: currentFinding });
      return;
    }

    const finding = {
      id: `finding:${toothId}:${selectedConditionCode}`,
      toothId,
      conditionCode: selectedConditionCode,
    } as const;
    const nextValue: OdontogramValue = {
      ...value,
      findings: [...value.findings, finding],
    };
    onChange(nextValue, { type: 'finding.added', finding });
  }

  function renderArch(kind: 'PRIMARY' | 'PERMANENT', arch: DentalArch) {
    const teeth = getArchTeeth(kind, arch);
    return (
      <div
        className="ignitron-odontogram__arch"
        data-arch={arch.toLowerCase()}
        aria-label={`${kind.toLowerCase()} ${arch.toLowerCase()} arch`}
      >
        {teeth.map((tooth) => (
          <ToothButton
            key={tooth.id}
            tooth={tooth}
            value={value}
            conditions={conditionMap}
            numberingSystem={numberingSystem}
            activeConditionCode={selectedConditionCode}
            readOnly={readOnly}
            onToggle={toggleFinding}
          />
        ))}
      </div>
    );
  }

  return (
    <section
      id={rootId}
      className={['ignitron-odontogram', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-mode={mode}
    >
      {validationErrors.length > 0 && (
        <div className="ignitron-odontogram__errors" role="alert">
          <strong>Invalid odontogram configuration</strong>
          <ul>{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}

      <header className="ignitron-odontogram__header">
        <div>
          <p className="ignitron-odontogram__eyebrow">Dental chart</p>
          <h2>Odontogram</h2>
        </div>
        <div className="ignitron-odontogram__meta">
          <span>{numberingSystem}</span><span>{dentition}</span><span>{mode}</span>
        </div>
      </header>

      {!readOnly && (
        <fieldset className="ignitron-odontogram__conditions">
          <legend>Finding to apply</legend>
          <div>
            {conditions.map((condition) => (
              <button
                key={condition.code}
                type="button"
                aria-pressed={selectedConditionCode === condition.code}
                onClick={() => selectCondition(condition.code)}
                style={
                  condition.color
                    ? ({ '--ignitron-condition-accent': condition.color } as React.CSSProperties)
                    : undefined
                }
              >
                <span aria-hidden="true">{condition.symbol}</span>{condition.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="ignitron-odontogram__chart">
        {getDentitionKinds(dentition).map((kind) => (
          <div className="ignitron-odontogram__dentition" key={kind}>
            {dentition === 'MIXED' && <h3>{kind === 'PRIMARY' ? 'Primary dentition' : 'Permanent dentition'}</h3>}
            {renderArch(kind, 'MAXILLARY')}
            <div className="ignitron-odontogram__midline" aria-hidden="true"><span>R</span><i /><span>L</span></div>
            {renderArch(kind, 'MANDIBULAR')}
          </div>
        ))}
      </div>

      <footer className="ignitron-odontogram__legend" aria-label="Finding legend">
        {conditions.map((condition) => (
          <span key={condition.code}>
            <i style={condition.color ? { background: condition.color } : undefined}>{condition.symbol}</i>
            {condition.label}
          </span>
        ))}
      </footer>
    </section>
  );
}
