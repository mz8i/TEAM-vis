import { atom, selector, selectorFamily } from 'recoil';

import {
  DimensionPath,
  getWithPath,
  makeDimPath,
} from '../../data/dimension-paths';
import { LeafDimensionValue } from '../../data/dimensions';
import { loadMultiScenarioFactTable } from '../../data/fetch/tables/facts';
import { linkFactDimensions } from '../../data/load/link-fact-dimensions';
import { ScenarioValue } from '../../data/scenario';
import {
  filterTable,
  getFiltersFromOps,
  getGroupingsFromOps,
  groupTable,
  makeGroupKeyFn,
  makeGroupObjFn,
  ungroupTable,
} from '../../data/transform/fact-processing';
import { dataSelectionByDimPathState } from './data-operations/data-operations-state';
import { dataSourceByNameState } from './data-source-state';
import { activeTabContentState } from './data-tab-state';
import {
  allDimensionsMetaState,
  domainStoreByDimensionState,
} from './dimensions/dimensions-state';

export type DataViewIdParam = FactTableParams;

export type FactTableParams = {
  variableName: string;
  params: Record<string, LeafDimensionValue>;
  scenarios: ScenarioValue[];
};

export const factTableState = selectorFamily({
  key: 'factTable',
  dangerouslyAllowMutability: true,
  get:
    ({ variableName, params, scenarios }: Readonly<FactTableParams>) =>
    async ({ get }) => {
      const dataSource = get(dataSourceByNameState(variableName));
      const dimensionsMetadata = get(allDimensionsMetaState);
      const getStore = (dim: string) => get(domainStoreByDimensionState(dim));

      const factTable = await loadMultiScenarioFactTable(
        dataSource,
        scenarios,
        params
      );

      return linkFactDimensions(factTable, dimensionsMetadata, getStore);
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

      const aggregatedTable = groupTable(table, groupKeyFn, groupObjFn)
        .generateSeries({
          Value: ({ Rows }) => Rows.deflate((row: any) => row.Value).sum(),
        })
        .dropSeries('Rows');

      return ungroupTable(aggregatedTable);
    },
});

export const totalDataState = selectorFamily({
  key: 'totalData',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const table = get(rootTableState(dataViewId));

      const groupedTable = table
        .groupBy((row) => row.Year)
        .select((group) => ({
          GroupKey: group.first().Year,
          Grouping: { Year: group.first().Year },
          Value: group.deflate((row) => row.Value).sum(),
        }))
        .inflate();

      return ungroupTable(groupedTable);
    },
});
