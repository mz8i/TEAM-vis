import { Meta, StoryObj } from '@storybook/react';

import { DataDomain } from '../../types/data';
import { SecondarySelect } from './SecondarySelect';

const meta = {
  title: 'SecondarySelect',
  component: SecondarySelect,
} satisfies Meta<typeof SecondarySelect>;

export default meta;

type Story = StoryObj<typeof meta>;

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
