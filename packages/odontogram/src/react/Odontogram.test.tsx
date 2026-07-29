import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createEmptyOdontogramValue } from '../core';
import type { OdontogramCondition, OdontogramValue } from '../core';
import { Odontogram } from './Odontogram';

const conditions: OdontogramCondition[] = [
  { code: 'CARIES', label: 'Caries', symbol: 'C', color: '#dc2626' },
  { code: 'MISSING', label: 'Missing', symbol: 'X', color: '#475569' },
];

describe('Odontogram', () => {
  it('renders permanent FDI teeth with accessible labels', () => {
    render(
      <Odontogram
        value={createEmptyOdontogramValue()}
        conditions={conditions}
        numberingSystem="FDI"
        dentition="PERMANENT"
      />,
    );

    expect(screen.getByRole('button', { name: 'Tooth 18, permanent, no finding' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tooth 48, permanent, no finding' })).toBeInTheDocument();
  });

  it('emits a domain event and updates a controlled value', async () => {
    const eventSpy = vi.fn();

    function Harness() {
      const [value, setValue] = useState<OdontogramValue>(createEmptyOdontogramValue());
      return (
        <Odontogram
          value={value}
          conditions={conditions}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            eventSpy(event);
          }}
        />
      );
    }

    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Tooth 18, permanent, no finding' }));

    expect(screen.getByRole('button', { name: 'Tooth 18, permanent, Caries' })).toHaveAttribute('aria-pressed', 'true');
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'finding.added' }));
  });

  it('prevents edits in read-only mode', async () => {
    const onChange = vi.fn();
    render(
      <Odontogram
        value={createEmptyOdontogramValue()}
        conditions={conditions}
        mode="readOnly"
        onChange={onChange}
      />,
    );

    const tooth = screen.getByRole('button', { name: 'Tooth 18, permanent, no finding' });
    expect(tooth).toBeDisabled();
    await userEvent.click(tooth);
    expect(onChange).not.toHaveBeenCalled();
  });
});
