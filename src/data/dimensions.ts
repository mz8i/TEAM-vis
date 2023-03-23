import _ from 'lodash';

export interface DimensionMeta {
  Slug: string;
  Name: string;
  IsLeaf: boolean;
  Colors?: Record<string, string>;
}

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
