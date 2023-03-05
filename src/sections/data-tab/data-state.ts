import { IDataFrame } from 'data-forge';
import { atom, selector, selectorFamily } from 'recoil';

import { ScenarioConfig } from '../../data/models/scenario';
import {
  DimensionValue,
  LeafDimensionValue,
} from '../../data/tables/dimensions';
import { loadFactTable } from '../../data/tables/facts';
import { DataSelectionValue } from '../../types/data';
import { dataSelectionByDimPathState } from './data-operations/data-operations-state';
import {
  DimensionPath,
  getWithPath,
  makeDimPath,
} from './data-operations/dimension-paths';
import { dataSourceByNameState } from './data-source-state';
import { activeTabContentState } from './data-tab-state';
import {
  allDimensionsMetaState,
  getLinkedDimensionStores,
} from './dimensions/dimensions-state';

export type DataViewIdParam = FactTableParams;

export type FactTableParams = {
  variableName: string;
  params: Record<string, LeafDimensionValue>;
  scenario: ScenarioConfig;
};

export interface YearValue {
  Year: number;
  Value: number;
}
export interface DataGroup {
  GroupKey: string;
  GroupLabel: string;
  Grouping: any;
  Rows: YearValue[];
}

export const factTableState = selectorFamily({
  key: 'factTable',
  dangerouslyAllowMutability: true,
  get:
    ({ variableName, params, scenario }: Readonly<FactTableParams>) =>
    async ({ get }) => {
      const dataSource = get(dataSourceByNameState(variableName));

      const factTable = await loadFactTable(dataSource, scenario, params);

      const columns = factTable.getColumnNames();
      const dimensionsMetadata = get(allDimensionsMetaState);
      const linkedStores = getLinkedDimensionStores(
        columns,
        dimensionsMetadata,
        get
      );

      return factTable
        .transformSeries({
          Value: (value) => (value === '' ? 0 : +value),
          Year: (value) => +value,
        })
        .generateSeries(
          Object.fromEntries(
            Object.entries(linkedStores).map(
              ([column, { dimension, store }]) => [
                dimension,
                (row) => store.get(row[column], 'ID'),
              ]
            )
          )
        )
        .dropSeries(Object.keys(linkedStores));
    },
});

export const currentChartOpsState = selector({
  key: 'currentChartOps',
  get: ({ get }) => {
    return {
      Year: {
        aggregate: false,
        filter: null,
      },
    };
  },
});

export const currentDataParamsState = atom<FactTableParams>({
  key: 'currentDataParamsState',
  default: new Promise(() => {}),
});

export const rootTableState = selectorFamily({
  key: 'rootTable',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      return get(factTableState(dataViewId));
    },
});

interface DataOp {
  path: DimensionPath;
  ops: DataSelectionValue<DimensionValue>;
}
interface DataFilterOp {
  path: DimensionPath;
  values: any[];
}

type DataGroupOp = DimensionPath;

export const primaryOpsState = selectorFamily({
  key: 'primaryOps',
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const currentChartOps = get(currentChartOpsState);
      const { operations: viewOps = {}, primarySelect: primaryOps } = get(
        activeTabContentState
      );

      const ops = [
        ...Object.entries(currentChartOps),
        ...Object.entries(viewOps),
        ...primaryOps.map(
          (dimPath) =>
            [dimPath, get(dataSelectionByDimPathState(dimPath))] as const
        ),
      ].map(([path, ops]) => ({
        path: path instanceof DimensionPath ? path : makeDimPath(path),
        ops,
      }));

      return ops;
    },
});

export const primaryFilteredTableState = selectorFamily({
  key: 'primaryFilteredTable',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const rootTable = get(rootTableState(dataViewId));

      const ops = get(primaryOpsState(dataViewId));

      const filters = getFiltersFromOps(ops);

      return filterTable(rootTable, filters);
    },
});

export const valuesAfterPrimaryFilterByPathState = selectorFamily({
  key: 'valuesAfterPrimaryFilterByPath',
  get:
    ({
      path,
      dataViewId,
    }: {
      path: DimensionPath;
      dataViewId: DataViewIdParam;
    }) =>
    ({ get }) => {
      return get(primaryFilteredTableState(dataViewId))
        .deflate((row) => getWithPath(row, path))
        .distinct()
        .toArray();
    },
});

export const secondaryOpsState = selectorFamily({
  key: 'secondaryOps',
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const { secondarySelect } = get(activeTabContentState);

      const ops = secondarySelect.map((dimPath) => ({
        path: dimPath,
        ops: get(dataSelectionByDimPathState(dimPath)),
      }));

      return ops;
    },
});

export const secondaryFilteredTableState = selectorFamily({
  key: 'secondaryFilteredTable',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const ops = get(secondaryOpsState(dataViewId));
      const table = get(primaryFilteredTableState(dataViewId));

      const filters = getFiltersFromOps(ops);

      return filterTable(table, filters);
    },
});

export const allOpsState = selectorFamily({
  key: 'allOps',
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      return [
        ...get(primaryOpsState(dataViewId)),
        ...get(secondaryOpsState(dataViewId)),
      ];
    },
});

export const currentDataState = selectorFamily({
  key: 'currentData',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const allOps = get(allOpsState(dataViewId));
      const table = get(secondaryFilteredTableState(dataViewId));

      const groupBy = getGroupingsFromOps(allOps);

      const groupKeyFn = makeGroupKeyFn(groupBy);
      const groupObjFn = makeGroupObjFn(groupBy);

      const groupedTable = table
        .groupBy((row) => groupKeyFn(row))
        .select((group) => {
          return {
            GroupKey: groupKeyFn(group.first()),
            Grouping: groupObjFn(group.first()),
            Value: group.deflate((row) => row.Value).sum(),
          };
        })
        .inflate();

      return ungroupTable(groupedTable);
    },
});

// export const currentDataState = selector({
//   key: 'currentData',
//   dangerouslyAllowMutability: true,
//   get: ({ get }) => {
//     const fullTable = get(rootTableState);

//     const {
//       operations: viewOps = {},
//       primarySelect: primaryOps,
//       secondarySelect: secondaryOps,
//     } = get(activeTabContentState);

//     const allOps = [
//       ...Object.entries(currentChartOps),
//       ...Object.entries(viewOps),
//       ...primaryOps.map(
//         (dimPath) =>
//           [dimPath, get(dataSelectionByDimPathState(dimPath))] as const
//       ),
//       ...secondaryOps.map(
//         (dimPath) =>
//           [dimPath, get(dataSelectionByDimPathState(dimPath))] as const
//       ),
//     ].map(([path, ops]) => ({
//       path: path instanceof DimensionPath ? path : makeDimPath(path),
//       ops,
//     }));

//     const filters = allOps
//       .filter((x) => x.ops.filter != null)
//       .map((x) => [x.path, x.ops.filter!]);

// const groupBy: DimensionPath[] = allOps
//   .filter((x) => x.ops.aggregate === false)
//   .map((x) => x.path);

//     const filterFn = makeFilterFn(filters);

//     const groupedTable = fullTable
//       .filter((row) => filterFn(row))
//       .groupBy((row) => groupKeyFn(row))
//       .select((group) => {
//         return {
//           GroupKey: groupKeyFn(group.first()),
//           Grouping: groupObjFn(group.first()),
//           Value: group.deflate((row) => row.Value).sum(),
//         };
//       })
//       .inflate();

//     return ungroupTable(groupedTable);
//   },
// });

function getFiltersFromOps(allOps: DataOp[]): DataFilterOp[] {
  return allOps
    .filter((x) => x.ops.filter != null)
    .map((x) => ({ path: x.path, values: x.ops.filter! }));
}

function filterTable(df: IDataFrame, filters: DataFilterOp[]) {
  const filterFn = makeFilterFn(filters);

  return df.filter((row) => filterFn(row));
}

function getGroupingsFromOps(allOps: DataOp[]): DataGroupOp[] {
  return allOps.filter((x) => x.ops.aggregate === false).map((x) => x.path);
}

function makeFilterFn(filters: DataFilterOp[]) {
  return (row: any) => {
    for (const { path, values } of filters) {
      if (!values.includes(getWithPath(row, path))) {
        return false;
      }
    }
    return true;
  };
}

export function makeGroupKeyFn(
  groupPaths: (string | DimensionPath)[],
  separator = '@@',
  objField = 'AB'
) {
  return (row: any) =>
    groupPaths
      .map((path) => {
        const target = getWithPath(row, path);
        if (typeof target === 'object') {
          return target[objField];
        } else {
          return target;
        }
      })
      .join(separator);
}

export function makeGroupObjFn(groupPaths: (string | DimensionPath)[]) {
  return (row: any) =>
    Object.fromEntries(
      groupPaths.map((path) => [`${path}`, getWithPath(row, path)])
    );
}

export function ungroupTable(groupedTable: IDataFrame) {
  const groupingDf = groupedTable.getSeries('Grouping').inflate();

  return groupingDf.merge(groupedTable.dropSeries(['Grouping', 'GroupKey']));
}
