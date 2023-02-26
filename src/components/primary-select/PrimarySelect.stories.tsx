import type { Meta, StoryObj } from '@storybook/react';

import { Complex, getComplexLabel, v1, v2 } from '../_storybook/values';
import { PrimarySelect } from './PrimarySelect';

export default {
  title: 'PrimarySelect',
  component: PrimarySelect<string>,
} satisfies Meta<typeof PrimarySelect<string>>;

type Story<T = string> = StoryObj<Meta<typeof PrimarySelect<T>>>;

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

export const ComplexValues: Story<Complex> = {
  args: {
    value: {
      aggregate: false,
      filter: [v1],
    },
    domain: [v1, v2],
    getLabel: getComplexLabel,
  },
};
