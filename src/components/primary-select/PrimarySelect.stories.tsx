import type { Meta, StoryObj } from '@storybook/react';

import { PrimarySelect } from './PrimarySelect';

const meta = {
  title: 'PrimarySelect',
  component: PrimarySelect,
} satisfies Meta<typeof PrimarySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aggregated: Story = {
  args: {
    value: {
      aggregate: true,
      filter: ['Aeroplanes', 'Cars'],
    },
    domain: ['Aeroplanes', 'Cars', 'Ships'],
  },
};

export const Disaggregated: Story = {
  args: {
    value: {
      aggregate: false,
      filter: ['Aeroplanes', 'Cars'],
    },
    domain: ['Aeroplanes', 'Cars', 'Ships'],
  },
};
