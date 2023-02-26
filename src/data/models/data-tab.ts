import {
  CheckerReturnType,
  array,
  bool,
  dict,
  mixed,
  nullable,
  object,
  optional,
  string,
} from '@recoiljs/refine';

export const dataOperationChecker = object({
  aggregate: bool(),
  filter: nullable(array(mixed())),
});

export const dataTabContentChecker = object({
  variables: array(string()),
  primarySelect: nullable(string()),
  secondarySelect: array(string()),
  operations: optional(dict(dataOperationChecker)),
});

export const dataTabChecker = object({
  slug: string(),
  label: string(),
  content: dataTabContentChecker,
});

export type DataTab = CheckerReturnType<typeof dataTabChecker>;

export const allDataTabsChecker = array(dataTabChecker);
