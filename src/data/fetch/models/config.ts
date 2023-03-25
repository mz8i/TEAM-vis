import { array, number, object } from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../../utils/recoil/refine';

export const configChecker = object({
  minYear: number(),
  maxYear: number(),
  snapshotYears: array(number()),
});

export type ConfigType = MutableCheckerReturn<typeof configChecker>;
