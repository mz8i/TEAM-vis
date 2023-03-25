import {
  Checker,
  array,
  bool,
  dict,
  mixed,
  nullable,
  object,
  optional,
  string,
  stringLiterals,
} from '@recoiljs/refine';

import { CHART_TYPES } from '../../../sections/data-tab/data-display/chart-types';
import { DataSelectionValue } from '../../../types/data';
import { MutableCheckerReturn } from '../../../utils/recoil/refine';

export const dataOperationChecker = object({
  aggregate: bool(),
  filter: nullable(array(mixed())),
}) as Checker<DataSelectionValue<any>>;

export const variableChecker = object({
  name: string(),
  parameters: array(string()),
});

export type VariableConfig = MutableCheckerReturn<typeof variableChecker>;

const chartTypeChecker = stringLiterals(
  Object.fromEntries(CHART_TYPES.map((ct) => [ct, ct]))
);

export const dataTabDefaultChartChecker = object({
  type: chartTypeChecker,
  options: dict<any>(mixed()),
});

export type ChartConfig = MutableCheckerReturn<
  typeof dataTabDefaultChartChecker
>;

export const dataTabContentChecker = object({
  variable: variableChecker,
  primarySelect: nullable(string()),
  secondarySelect: array(string()),
  operations: optional(dict(dataOperationChecker)),
  defaultChart: dataTabDefaultChartChecker,
});

export type DataTabContentConfigInput = MutableCheckerReturn<
  typeof dataTabContentChecker
>;

export const dataTabChecker = object({
  slug: string(),
  label: string(),
  content: dataTabContentChecker,
});

export type DataTabConfigInput = MutableCheckerReturn<typeof dataTabChecker>;

export const allDataTabsChecker = array(dataTabChecker);
