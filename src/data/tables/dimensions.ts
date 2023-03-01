import { array, assertion, object, optional, string } from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../utils/recoil/refine';
import { loadCsv } from '../load';

export const dimensionValueChecker = object({
  ID: string(),
  AB: optional(string()),
  NA: string(),
});

export type DimensionValue = MutableCheckerReturn<typeof dimensionValueChecker>;

const dimensionValueListChecker = array(dimensionValueChecker);

type DimensionValueList = MutableCheckerReturn<
  typeof dimensionValueListChecker
>;

export async function loadDimensionValues(dimension: string) {
  const data = await loadCsv(`data/tables/dimensions/${dimension}.csv`);
  const valueList = assertion(dimensionValueListChecker)(
    data
  ) as DimensionValueList;

  const processed = processDimensionValues(valueList);

  const store = new DomainStore(processed, dimension);

  return store;
}

function processDimensionValues(values: DimensionValue[]) {
  return values.map((x) => ({
    ...x,
    AB: x.AB ?? x.NA,
  }));
}

export class DomainStore {
  constructor(
    public readonly values: DimensionValue[],
    public readonly name: string
  ) {}

  public get(key: string, by: keyof DimensionValue = 'ID') {
    return this.values.find((x) => x[by] === key);
  }
}
