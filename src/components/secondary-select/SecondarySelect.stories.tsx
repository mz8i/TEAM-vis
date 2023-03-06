import { Meta, StoryObj } from '@storybook/react';

import { DataDomain } from '../../types/data';
import { Complex, getComplexLabel, v1, v2 } from '../_storybook/values';
import { SecondarySelect } from './SecondarySelect';

const meta = {
  title: 'SecondarySelect',
  component: SecondarySelect,
} satisfies Meta<typeof SecondarySelect>;

export default meta;

type Story<T = string> = StoryObj<Meta<typeof SecondarySelect<T>>>;

const VALUES = [
  'Diesel',
  'Gasoline',
  'Electric',
  'Biofuel',
  'Unobtainium',
  'Some Other Fuel Type',
];
const DOMAIN: DataDomain<string> = {
  values: VALUES,
  allowed: VALUES,
  shown: VALUES,
};

export const Aggregated: Story = {
  args: {
    title: 'Fuel Type',
    domain: DOMAIN,
    value: {
      aggregate: true,
      filter: null,
    },
  },
};

export const Disaggregated: Story = {
  args: {
    title: 'Fuel Type',
    domain: DOMAIN,
    value: {
      aggregate: false,
      filter: [],
    },
  },
};

export const ComplexValues: Story<Complex> = {
  args: {
    title: 'Complex Variable',
    domain: {
      values: [v1, v2],
      allowed: [v1, v2],
      shown: [v1, v2],
    },
    value: {
      aggregate: false,
      filter: [v2],
    },
    getLabel: getComplexLabel,
  },
};

const LONG = [...Array(100)].map((x, i) => i + '');

export const LongValuesList: Story = {
  args: {
    title: 'Variable',
    domain: {
      values: LONG,
      allowed: LONG,
      shown: LONG,
    },
    value: {
      aggregate: false,
      filter: LONG,
    },
  },
  render: (props) => (
    <div
      style={{
        height: '400px',
        width: '200px',
        padding: 5,
        backgroundColor: '#ccc',
      }}
    >
      <SecondarySelect {...props} />
    </div>
  ),
};
