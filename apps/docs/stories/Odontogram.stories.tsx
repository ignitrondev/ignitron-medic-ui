import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Odontogram,
  createEmptyOdontogramValue,
  createToothId,
} from '@ignitrondev/odontogram';
import type {
  OdontogramCondition,
  OdontogramProps,
  OdontogramValue,
} from '@ignitrondev/odontogram';

const conditions: OdontogramCondition[] = [
  { code: 'CARIES', label: 'Caries', symbol: 'C', color: '#dc2626' },
  { code: 'FILLED', label: 'Filled', symbol: 'F', color: '#2563eb' },
  { code: 'MISSING', label: 'Missing', symbol: 'X', color: '#475569' },
  { code: 'ROOT_REMAINS', label: 'Root remains', symbol: 'R', color: '#9333ea' },
];

function ControlledOdontogram(props: OdontogramProps) {
  const [value, setValue] = useState(props.value);
  return <Odontogram {...props} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Clinical Components/Odontogram',
  component: Odontogram,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A controlled React odontogram. The visual renderer receives a structured value and emits a new value plus a domain event. It performs no network requests.',
      },
    },
  },
  args: {
    value: createEmptyOdontogramValue(),
    conditions,
    numberingSystem: 'FDI',
    dentition: 'PERMANENT',
    mode: 'edit',
  },
  render: (args) => <ControlledOdontogram {...args} />,
} satisfies Meta<typeof Odontogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const ExistingFindings: Story = {
  args: {
    value: {
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
    } satisfies OdontogramValue,
  },
};

export const PrimaryUniversal: Story = {
  args: {
    dentition: 'PRIMARY',
    numberingSystem: 'UNIVERSAL',
  },
};

export const MixedDentition: Story = {
  args: {
    dentition: 'MIXED',
  },
};

export const ReadOnly: Story = {
  args: {
    mode: 'readOnly',
    value: ExistingFindings.args?.value ?? createEmptyOdontogramValue(),
  },
};

export const PrintMode: Story = {
  args: {
    mode: 'print',
    value: ExistingFindings.args?.value ?? createEmptyOdontogramValue(),
  },
};
