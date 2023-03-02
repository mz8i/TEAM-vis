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
} from '@recoiljs/refine';

import { DataSelectionValue } from '../../types/data';
import { MutableCheckerReturn } from '../../utils/recoil/refine';

export const dataOperationChecker = object({
  aggregate: bool(),
  filter: nullable(array(mixed())),
}) as Checker<DataSelectionValue<any>>;

export const variableChecker = object({
  name: string(),
  parameters: array(string()),
});

export type VariableConfig = MutableCheckerReturn<typeof variableChecker>;

export const dataTabContentChecker = object({
  variable: variableChecker,
  primarySelect: nullable(string()),
  secondarySelect: array(string()),
  operations: optional(dict(dataOperationChecker)),
});

export const dataTabChecker = object({
  slug: string(),
  label: string(),
  content: dataTabContentChecker,
});

export type DataTabConfig = MutableCheckerReturn<typeof dataTabChecker>;

export const allDataTabsChecker = array(dataTabChecker);
