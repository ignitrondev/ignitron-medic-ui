import { describe, expect, it } from 'vitest';
import { createToothId, formatToothNumber, parseToothId } from './dentition';

describe('tooth numbering', () => {
  it.each([
    [createToothId('PERMANENT', 'MAXILLARY', 'RIGHT', 8), '18', '1'],
    [createToothId('PERMANENT', 'MAXILLARY', 'LEFT', 8), '28', '16'],
    [createToothId('PERMANENT', 'MANDIBULAR', 'LEFT', 8), '38', '17'],
    [createToothId('PERMANENT', 'MANDIBULAR', 'RIGHT', 8), '48', '32'],
    [createToothId('PRIMARY', 'MAXILLARY', 'RIGHT', 5), '55', 'A'],
    [createToothId('PRIMARY', 'MAXILLARY', 'LEFT', 5), '65', 'J'],
    [createToothId('PRIMARY', 'MANDIBULAR', 'LEFT', 5), '75', 'K'],
    [createToothId('PRIMARY', 'MANDIBULAR', 'RIGHT', 5), '85', 'T'],
  ])('maps %s to FDI %s and Universal %s', (id, fdi, universal) => {
    const tooth = parseToothId(id);
    expect(formatToothNumber(tooth, 'FDI')).toBe(fdi);
    expect(formatToothNumber(tooth, 'UNIVERSAL')).toBe(universal);
  });

  it('formats a readable Palmer identifier', () => {
    const tooth = parseToothId(createToothId('PERMANENT', 'MANDIBULAR', 'LEFT', 3));
    expect(formatToothNumber(tooth, 'PALMER')).toBe('LL3');
  });
});
