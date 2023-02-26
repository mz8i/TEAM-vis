import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { Complex, getComplexLabel, v1, v2 } from '../_storybook/values';
import { ChipSelect } from './ChipSelect';

const meta = {
  title: 'ChipSelect',
  component: ChipSelect<string>,
} satisfies Meta<typeof ChipSelect<string>>;

export default meta;
type Story<T = string> = StoryObj<Meta<typeof ChipSelect<T>>>;

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

export const ComplexValues: Story<Complex> = {
  args: {
    values: [v1, v2],
    selected: [v2],
    getLabel: getComplexLabel,
  },
};
