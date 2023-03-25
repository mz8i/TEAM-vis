import { selectorFamily } from 'recoil';

import { LeafDimensionValue } from '../../data/dimensions';
import { loadMultiScenarioFactTable } from '../../data/fetch/tables/facts';
import { linkFactDimensions } from '../../data/load/link-fact-dimensions';
import { ScenarioValue } from '../../data/scenario';
import {
  filterTable,
  getFiltersFromOps,
  groupTable,
  makeGroupKeyFn,
  makeGroupObjFn,
  ungroupTable,
} from '../../data/transform/fact-processing';
import { ChartType } from './data-display/chart-types';
import { dataSourceByNameState } from './data-source-state';
import {
  allDimensionsMetaState,
  domainStoreByDimensionState,
} from './dimensions/dimensions-state';
import {
  ViewParams,
  allGroupingsState,
  primaryOpsState,
  secondaryOpsState,
} from './fact-ops-state';

export type DataViewParams = {
  factTableParams: FactTableParams;
  viewParams: ViewParams;
  chartType: ChartType;
};

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

export const primaryFilteredTableState = selectorFamily({
  key: 'primaryFilteredTable',
  dangerouslyAllowMutability: true,
  get:
    ({ factTableParams, viewParams }: DataViewParams) =>
    ({ get }) => {
      const rootTable = get(factTableState(factTableParams));

      const ops = get(primaryOpsState(viewParams));

      const filters = getFiltersFromOps(ops);

      return filterTable(rootTable, filters);
    },
});

export const secondaryFilteredTableState = selectorFamily({
  key: 'secondaryFilteredTable',
  dangerouslyAllowMutability: true,
  get:
    (dataViewParams: DataViewParams) =>
    ({ get }) => {
      const ops = get(secondaryOpsState(dataViewParams.viewParams));
      const table = get(primaryFilteredTableState(dataViewParams));

      const filters = getFiltersFromOps(ops);

      return filterTable(table, filters);
    },
});

export const currentDataState = selectorFamily({
  key: 'currentData',
  dangerouslyAllowMutability: true,
  get:
    (dataViewParams: DataViewParams) =>
    ({ get }) => {
      const table = get(secondaryFilteredTableState(dataViewParams));

      const groupBy = get(allGroupingsState(dataViewParams.viewParams));

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
