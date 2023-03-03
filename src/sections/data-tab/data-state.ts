import { IDataFrame } from 'data-forge';
import { selector, selectorFamily } from 'recoil';

import { VariableConfig } from '../../data/models/data-tab';
import { ScenarioConfig } from '../../data/models/scenario';
import { loadFactTable } from '../../data/tables/facts';
import { scenarioState } from '../scenario/scenario-state';
import {
  DimensionPath,
  currentPrimaryDimPathState,
  currentSecondaryDimPathsState,
  dataSelectionByDimExprState,
} from './data-operations/data-operations-state';
import { dataSourceByNameState } from './data-source-state';
import { activeTabState } from './data-tab-state';
import {
  allDimensionsMetaState,
  getLinkedDimensionStores,
} from './dimensions/dimensions-state';
import { paramsByVariableConfigState } from './variables/variable-state';

export interface FactTableParams {
  variableConfig: VariableConfig;
  scenario: ScenarioConfig;
}

export const factTableState = selectorFamily({
  key: 'factTable',
  dangerouslyAllowMutability: true,
  get:
    ({ variableConfig, scenario }: Readonly<FactTableParams>) =>
    async ({ get }) => {
      const dataSource = get(dataSourceByNameState(variableConfig.name));
      const params = get(paramsByVariableConfigState(variableConfig));

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

function isNonNullable<TValue>(
  value: TValue | undefined | null
): value is TValue {
  return value !== null && value !== undefined;
}

export const currentDataState = selector({
  key: 'currentData',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const scenario = get(scenarioState);
    const {
      content: { variable: variableConfig, operations: viewOps = {} },
    } = get(activeTabState);

    const fullTable = get(
      factTableState({
        scenario,
        variableConfig,
      })
    );

    const currentChartOps = get(currentChartOpsState);

    const primaryOp = get(currentPrimaryDimPathState);
    const secondaryOps = get(currentSecondaryDimPathsState);

    const allOps = [
      ...Object.entries(currentChartOps),
      ...Object.entries(viewOps),
      ...(primaryOp
        ? [
            [
              primaryOp,
              get(dataSelectionByDimExprState(primaryOp.rawExpression)),
            ] as const,
          ]
        : []),
      ...secondaryOps.map(
        (dimPath) =>
          [
            dimPath,
            get(dataSelectionByDimExprState(dimPath.rawExpression)),
          ] as const
      ),
    ]
      .filter(isNonNullable)
      .map(([path, ops]) => ({
        path: path instanceof DimensionPath ? path : new DimensionPath(path),
        ops,
      }));

    const filters: [DimensionPath, any[]][] = allOps
      .filter((x) => x.ops.filter != null)
      .map((x) => [x.path, x.ops.filter!]);

    const groupBy: DimensionPath[] = allOps
      .filter((x) => x.ops.aggregate === false)
      .map((x) => x.path);

    const filterFn = makeFilterFn(filters);
    const groupKeyFn = makeGroupKeyFn(groupBy);
    const groupObjFn = makeGroupObjFn(groupBy);

    const groupedTable = fullTable
      .filter((row) => filterFn(row))
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

function getWithPath(obj: any, path: string | DimensionPath) {
  if (typeof path === 'string') {
    return obj[path];
  }
  let current = obj;
  for (const token of path.joinList) {
    current = current[token];
  }
  return current;
}

function makeFilterFn(filters: [DimensionPath, any[]][]) {
  return (row: any) => {
    for (const [path, values] of filters) {
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
