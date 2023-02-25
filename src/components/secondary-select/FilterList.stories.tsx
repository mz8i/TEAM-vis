import { Meta, StoryObj } from '@storybook/react';

import { FilterList } from './FilterList';

const meta = {
  title: 'FilterList',
  component: FilterList,
} satisfies Meta<typeof FilterList>;

export default meta;

type Story = StoryObj<typeof meta>;

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
