import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { useState } from 'react';

import { ChipSelect, ChipSelectProps } from './ChipSelect';

const meta = {
  title: 'ChipSelect',
  component: ChipSelect,
} satisfies Meta<typeof ChipSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const VALUES = ['Cars', 'Aeroplanes', 'Motorcycless', 'Ships'];

export const Deselected: Story = {
  args: {
    values: VALUES,
    selected: [],
  },
};

export const SomeSelected: Story = {
  args: {
    values: VALUES,
    selected: ['Aeroplanes', 'Ships'],
  },
};

export const AllSelected: Story = {
  args: {
    values: VALUES,
    selected: VALUES,
  },
};

export const Disabled: Story = {
  args: {
    values: VALUES,
    selected: [],
    disabled: true,
  },
};

const Controlled = ({
  selected: selectedProp,
  onSelected,
  ...otherProps
}: ChipSelectProps) => {
  const [selected, setSelected] = useState(selectedProp);

  return (
    <ChipSelect selected={selected} onSelected={setSelected} {...otherProps} />
  );
};

export const Select: Story = {
  args: {
    values: VALUES,
    selected: ['Aeroplanes', 'Ships'],
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const carsChip = await canvas.getByText(/Cars/i);
    await userEvent.click(carsChip);
    await expect(args.onSelected).toHaveBeenCalled();
  },
};
