import {
  Checker,
  array,
  assertion,
  constraint,
  dict,
  string,
} from '@recoiljs/refine';
import _ from 'lodash';

import { MutableCheckerReturn } from '../../utils/recoil/refine';
import { loadCsv } from '../load';

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

export type LeafDimensionValue = {
  type: 'leaf';
  ID: string;
  AB: string;
  NA: string;
  Description?: string;
  Color?: string;
};

export type JoinDimensionValue = {
  type: 'join';
  ID: string;
} & { [key: string]: DimensionValue };

export type DimensionValue = LeafDimensionValue | JoinDimensionValue;

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

export class DomainStore<T extends DimensionValue = DimensionValue> {
  private valueLookups: Record<string, Record<string, T>>;

  constructor(
    public readonly values: T[],
    public readonly name: string,
    public readonly type: T['type'],
    public readonly hasColor: boolean,
    indexFields: (keyof T)[] = ['ID', 'AB']
  ) {
    this.valueLookups = {};
    for (const indField of indexFields) {
      this.valueLookups[indField as string] = _.keyBy(values, indField);
    }
  }

  /**
   * Find dimension value with specified attribute
   * @param key the attribute value to find
   * @param by the attribute name to search by (default: ID)
   */
  public get(key: string, by: keyof DimensionValue = 'ID') {
    if (by in this.valueLookups) {
      return this.valueLookups[by][key];
    } else {
      return this.values.find((x) => x[by] === key);
    }
  }
}
