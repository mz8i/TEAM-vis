import { Meta, StoryObj } from '@storybook/react';

import { Complex, getComplexLabel, v1, v2 } from '../_storybook/values';
import { FilterList } from './FilterList';

const meta = {
  title: 'FilterList',
  component: FilterList,
} satisfies Meta<typeof FilterList>;

export default meta;

type Story<T = string> = StoryObj<Meta<typeof FilterList<T>>>;

const VALUES = ['Diesel', 'Gasoline', 'Electric', 'Biofuel', 'Unobtainium'];
export const SomeDisallowed: Story = {
  args: {
    title: 'Fuel Type',
    values: VALUES,
    selected: [],
    allowed: ['Diesel', 'Electric'],
  },
};

export const Disabled: Story = {
  args: {
    title: 'Fuel Type',
    values: VALUES,
    selected: [],
    allowed: ['Diesel', 'Electric'],
    disabled: true,
  },
};

export const ComplexValues: Story<Complex> = {
  args: {
    title: 'Complex Variable',
    values: [v1, v2],
    selected: [v1],
    allowed: [v1, v2],
    getLabel: getComplexLabel,
  },
};
