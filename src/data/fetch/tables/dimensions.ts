import {
  Checker,
  array,
  assertion,
  constraint,
  dict,
  string,
} from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../../utils/recoil/refine';
import { loadCsv } from '../load-file';

export type InputDimensionValue = {
  ID: string;
  AB?: string;
  NA?: string;
  Description?: string;
  Color?: string;
} & Record<string, string>;

export const dimensionValueChecker: Checker<InputDimensionValue> = constraint(
  dict(string()),
  (x) => 'ID' in x
) as unknown as Checker<InputDimensionValue>;

const dimensionValueListChecker = array(dimensionValueChecker);

type DimensionValueList = MutableCheckerReturn<
  typeof dimensionValueListChecker
>;

export async function loadDimensionValues(dimension: string) {
  const data = await loadCsv(`data/tables/dimensions/${dimension}.csv`);
  const valueList = assertion(dimensionValueListChecker)(
    data
  ) as DimensionValueList;

  return valueList;
}
