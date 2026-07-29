import type { OdontogramCondition, OdontogramValue } from './types';

export function createEmptyOdontogramValue(): OdontogramValue {
  return { schemaVersion: 1, findings: [] };
}

export function validateOdontogramValue(value: OdontogramValue): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (value.schemaVersion !== 1) errors.push('Unsupported odontogram schema version.');

  for (const finding of value.findings) {
    if (!finding.id.trim()) errors.push('Every finding must have an id.');
    if (!finding.conditionCode.trim()) errors.push(`Finding ${finding.id} has no condition code.`);
    if (ids.has(finding.id)) errors.push(`Duplicate finding id: ${finding.id}.`);
    ids.add(finding.id);
  }

  return errors;
}

export function validateConditions(conditions: OdontogramCondition[]): string[] {
  const errors: string[] = [];
  const codes = new Set<string>();

  for (const condition of conditions) {
    if (!condition.code.trim()) errors.push('Every condition must have a code.');
    if (!condition.label.trim()) errors.push(`Condition ${condition.code} has no label.`);
    if (!condition.symbol.trim()) errors.push(`Condition ${condition.code} has no symbol.`);
    if (codes.has(condition.code)) errors.push(`Duplicate condition code: ${condition.code}.`);
    codes.add(condition.code);
  }

  return errors;
}
