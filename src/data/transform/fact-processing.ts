import { IDataFrame } from 'data-forge';

import { DataSelectionValue } from '../../types/data';
import { IDimPath, atPath } from '../dimension-paths';
import { DimensionValue } from '../dimensions';

export interface DataOp {
  path: IDimPath;
  ops: DataSelectionValue<DimensionValue>;
}
export interface DataFilterOp {
  path: IDimPath;
  values: any[];
}

export type DataGroupOp = IDimPath;

export function getFiltersFromOps(allOps: DataOp[]): DataFilterOp[] {
  return allOps
    .filter((x) => x.ops.filter != null)
    .map((x) => ({ path: x.path, values: x.ops.filter! }));
}

export function filterTable(df: IDataFrame, filters: DataFilterOp[]) {
  const filterFn = makeFilterFn(filters);

  return df.filter((row) => filterFn(row));
}

export function getGroupingsFromOps(allOps: DataOp[]): DataGroupOp[] {
  return allOps.filter((x) => x.ops.aggregate === false).map((x) => x.path);
}

export function makeFilterFn(filters: DataFilterOp[]) {
  return (row: any) => {
    for (const { path, values } of filters) {
      if (!values.includes(atPath(row, path))) {
        return false;
      }
    }
    return true;
  };
}

export type GroupKeyFunction = (row: any) => string;

export function makeGroupKeyFn(
  groupPaths: (string | IDimPath)[],
  separator = '@@',
  objField = 'AB'
) {
  return (row: any) =>
    groupPaths
      .map((path) => {
        const target = atPath(row, path);
        if (typeof target === 'object') {
          return target[objField];
        } else {
          return target;
        }
      })
      .join(separator);
}

export type GroupObjectFunction = (row: any) => Record<string, any>;

export function makeGroupObjFn(groupPaths: (string | IDimPath)[]) {
  return (row: any) =>
    Object.fromEntries(
      groupPaths.map((path) => [`${path}`, atPath(row, path)])
    );
}

export type GroupRowsFunction = (rows: IDataFrame) => any;

export interface DataGroup<GroupingT extends Record<string, any>> {
  GroupKey: string;
  Grouping: GroupingT;
}

export function groupTable<T>(
  table: IDataFrame<number, T>,
  groupKeyFn: GroupKeyFunction,
  groupObjFn: GroupObjectFunction,
  groupRowsFn: GroupRowsFunction = (rr) => rr
): IDataFrame<number, any> {
  return table
    .groupBy((row) => groupKeyFn(row))
    .select((group) => {
      return {
        GroupKey: groupKeyFn(group.first()),
        Grouping: groupObjFn(group.first()),
        Rows: groupRowsFn(group),
      };
    })
    .inflate();
}

export function ungroupTable<RowT extends Record<string, any>>(
  groupedTable: IDataFrame<number, DataGroup<RowT>>
) {
  const groupingDf = groupedTable.getSeries('Grouping').inflate();

  return groupingDf.merge(groupedTable.dropSeries(['Grouping', 'GroupKey']));
}
