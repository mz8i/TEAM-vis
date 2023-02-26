/**
 * Complex value type useful in Storybook stories
 * testing of UI components accepting complex values with a getLabel function
 */
export interface Complex {
  id: number;
  label: string;
}

export const v1: Complex = {
  id: 1,
  label: 'Value 1',
};

export const v2: Complex = {
  id: 2,
  label: 'Value 2',
};

export const getComplexLabel = (x: Complex) => x.label;
