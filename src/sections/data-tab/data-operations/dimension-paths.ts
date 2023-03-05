import _ from 'lodash';

const WARNING = "Don't call this directly, use makeDimPath()" as const;
export class DimensionPath {
  public readonly dimension: string;
  public readonly joinList: string[];
  constructor(public readonly rawExpression: string, warning: typeof WARNING) {
    const dims = rawExpression.split('.');

    this.dimension = dims[dims.length - 1];
    this.joinList = dims;
  }

  public toString() {
    return this.rawExpression;
  }
  public toJSON() {
    return `"${this.rawExpression}"`;
  }
}

export const makeDimPath = _.memoize(function dimPathImpl(dimExpr: string) {
  return new DimensionPath(dimExpr, WARNING);
});

export function getWithPath(obj: any, path: string | DimensionPath) {
  if (typeof path === 'string') {
    return obj[path];
  }
  let current = obj;
  for (const token of path.joinList) {
    current = current[token];
  }
  return current;
}
