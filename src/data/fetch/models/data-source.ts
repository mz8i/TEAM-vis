import { dict, number, object, string, voidable } from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../../utils/recoil/refine';

export const dataSourceChecker = object({
  pathSchema: string(),
  title: string(),
  yAxisTitle: string(),
  numberFractionalDigits: number(),
  yAxisFractionalDigits: voidable(number()),
  numberDivisor: voidable(number()),
  numberDivisorText: voidable(string()),
});

export type DataSourceConfig = MutableCheckerReturn<typeof dataSourceChecker>;

export const allDataSourcesChecker = dict(dataSourceChecker);

export type AllDataSourcesConfig = MutableCheckerReturn<
  typeof allDataSourcesChecker
>;
