export const CHART_TYPES = ['time-series', 'scenario-comparison'] as const;

export type ChartType = (typeof CHART_TYPES)[number];
