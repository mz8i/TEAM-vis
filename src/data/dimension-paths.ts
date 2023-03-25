import _ from 'lodash';

class DimPath {
  public readonly dimension: string;
  public readonly joinList: string[];
  constructor(public readonly rawExpression: string) {
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

export type IDimPath = InstanceType<typeof DimPath>;

export const makeDimPath = _.memoize(function dimPathImpl(
  dimExpr: string | DimPath
) {
  return isPath(dimExpr) ? dimExpr : new DimPath(dimExpr);
});

export function isPath(path: string | DimPath): path is DimPath {
  return path instanceof DimPath;
}

export function atPath(obj: any, path: string | DimPath) {
  if (typeof path === 'string') {
    return obj[path];
  }
  let current = obj;
  for (const token of path.joinList) {
    current = current[token];
  }
  return current;
}
