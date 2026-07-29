import type {
  CanonicalToothId,
  DentalArch,
  Dentition,
  Laterality,
  ToothDefinition,
  ToothKind,
  ToothNumberingSystem,
} from './types';

const range = (length: number): number[] => Array.from({ length }, (_, index) => index + 1);

export function createToothId(
  kind: ToothKind,
  arch: DentalArch,
  side: Laterality,
  position: number,
): CanonicalToothId {
  return `${kind}:${arch}:${side}:${position}`;
}

function createSide(
  kind: ToothKind,
  arch: DentalArch,
  side: Laterality,
  reverse: boolean,
): ToothDefinition[] {
  const positions = range(kind === 'PERMANENT' ? 8 : 5);
  if (reverse) positions.reverse();

  return positions.map((position) => ({
    id: createToothId(kind, arch, side, position),
    kind,
    arch,
    side,
    position,
  }));
}

export function getArchTeeth(kind: ToothKind, arch: DentalArch): ToothDefinition[] {
  return [
    ...createSide(kind, arch, 'RIGHT', true),
    ...createSide(kind, arch, 'LEFT', false),
  ];
}

export function getDentitionKinds(dentition: Dentition): ToothKind[] {
  if (dentition === 'MIXED') return ['PERMANENT', 'PRIMARY'];
  return [dentition];
}

function getFdiQuadrant(tooth: ToothDefinition): number {
  if (tooth.kind === 'PERMANENT') {
    if (tooth.arch === 'MAXILLARY') return tooth.side === 'RIGHT' ? 1 : 2;
    return tooth.side === 'LEFT' ? 3 : 4;
  }

  if (tooth.arch === 'MAXILLARY') return tooth.side === 'RIGHT' ? 5 : 6;
  return tooth.side === 'LEFT' ? 7 : 8;
}

function getUniversalPermanent(tooth: ToothDefinition): string {
  if (tooth.arch === 'MAXILLARY') {
    return String(tooth.side === 'RIGHT' ? 9 - tooth.position : 8 + tooth.position);
  }

  return String(tooth.side === 'LEFT' ? 25 - tooth.position : 24 + tooth.position);
}

function getUniversalPrimary(tooth: ToothDefinition): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRST';
  let index: number;

  if (tooth.arch === 'MAXILLARY') {
    index = tooth.side === 'RIGHT' ? 5 - tooth.position : 4 + tooth.position;
  } else {
    index = tooth.side === 'LEFT' ? 15 - tooth.position : 14 + tooth.position;
  }

  return alphabet[index] ?? '?';
}

export function formatToothNumber(
  tooth: ToothDefinition,
  numberingSystem: ToothNumberingSystem,
): string {
  if (numberingSystem === 'FDI') return `${getFdiQuadrant(tooth)}${tooth.position}`;
  if (numberingSystem === 'UNIVERSAL') {
    return tooth.kind === 'PERMANENT'
      ? getUniversalPermanent(tooth)
      : getUniversalPrimary(tooth);
  }

  const vertical = tooth.arch === 'MAXILLARY' ? 'U' : 'L';
  const horizontal = tooth.side === 'RIGHT' ? 'R' : 'L';
  return `${vertical}${horizontal}${tooth.position}`;
}

export function parseToothId(id: CanonicalToothId): ToothDefinition {
  const [kind, arch, side, rawPosition] = id.split(':');
  return {
    id,
    kind: kind as ToothKind,
    arch: arch as DentalArch,
    side: side as Laterality,
    position: Number(rawPosition),
  };
}
