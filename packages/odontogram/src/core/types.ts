export type Dentition = 'PRIMARY' | 'PERMANENT' | 'MIXED';

export type ToothNumberingSystem = 'FDI' | 'UNIVERSAL' | 'PALMER';

export type DentalArch = 'MAXILLARY' | 'MANDIBULAR';

export type Laterality = 'RIGHT' | 'LEFT';

export type ToothKind = 'PRIMARY' | 'PERMANENT';

export type ToothSurface =
  | 'OCCLUSAL'
  | 'INCISAL'
  | 'MESIAL'
  | 'DISTAL'
  | 'BUCCAL'
  | 'LABIAL'
  | 'LINGUAL'
  | 'PALATAL';

export type CanonicalToothId = `${ToothKind}:${DentalArch}:${Laterality}:${number}`;

export interface ToothDefinition {
  id: CanonicalToothId;
  kind: ToothKind;
  arch: DentalArch;
  side: Laterality;
  position: number;
}

export interface ToothFinding {
  id: string;
  toothId: CanonicalToothId;
  conditionCode: string;
  surface?: ToothSurface;
  note?: string;
}

export interface OdontogramValue {
  schemaVersion: 1;
  findings: ToothFinding[];
}

export interface OdontogramCondition {
  code: string;
  label: string;
  symbol: string;
  color?: string;
}

export type OdontogramMode = 'edit' | 'readOnly' | 'print';

export interface OdontogramChangeEvent {
  type: 'finding.added' | 'finding.removed';
  finding: ToothFinding;
}
