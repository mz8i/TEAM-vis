import { useMemo } from 'react';
import { selectorFamily, useRecoilValue } from 'recoil';

import { TimeSeriesChart } from '../../../../charts/chart-types/time-series/TimeSeriesChart';
import { prepareTimeSeriesDataSeries } from '../../../../charts/chart-types/time-series/prepare-data';
import { ChartConfig } from '../../../../data/fetch/models/data-tab';
import { ungroupTable } from '../../../../data/transform/fact-processing';
import { ConcurrentSetter } from '../../../../utils/recoil/ConcurrentSetter';
import { nullState } from '../../../../utils/recoil/null-state';
import { DataTabContentConfig } from '../../data-tab-state';
import { currentDataViewParamsState } from '../../data-view-state';
import {
  DataViewParams,
  FactTableParams,
  currentDataState,
  factTableState,
} from '../../fact-state';
import { useNumberFormat, useYAxisTitle } from '../chart-labels';
import { groupStyleMappingState } from '../data-style/data-style-state';

export const TimeSeriesDataViewParams = ({
  factTableParams,
  tabContent,
  chartConfig,
}: {
  factTableParams: FactTableParams;
  tabContent: DataTabContentConfig;
  chartConfig: ChartConfig;
}) => {
  const {
    primarySelect,
    secondarySelect,
    operations: tabOps = {},
  } = tabContent;
  const dataViewParams: DataViewParams = {
    factTableParams,
    viewParams: {
      primarySelect,
      secondarySelect,
      tabOps,
      chartOps: {
        Year: {
          aggregate: false,
          filter: null,
        },
      },
    },
    chartConfig,
  };

  return (
    <ConcurrentSetter
      state={currentDataViewParamsState}
      value={dataViewParams}
    />
  );
};

const totalDataState = selectorFamily({
  key: 'totalData',
  dangerouslyAllowMutability: true,
  get:
    (dataViewParams: DataViewParams) =>
    ({ get }) => {
      const table = get(factTableState(dataViewParams.factTableParams));

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

function useTotalData(dataViewParams: DataViewParams, calculate: boolean) {
  const totalTable = useRecoilValue(
    calculate ? totalDataState(dataViewParams) : nullState
  );

  return useMemo(
    () =>
      totalTable && {
        GroupKey: 'Total',
        GroupLabel: 'Total',
        Grouping: {},
        Rows: totalTable.subset(['Year', 'Value']).toArray(),
      },
    [totalTable]
  );
}

export function TimeSeriesDisplay({
  dataViewParams,
}: {
  dataViewParams: DataViewParams;
}) {
  const factTable = useRecoilValue(currentDataState(dataViewParams));
  const groupStyleMapping = useRecoilValue(
    groupStyleMappingState(dataViewParams.viewParams)
  );

  const totalData = useTotalData(
    dataViewParams,
    dataViewParams.chartConfig?.options?.totalLine
  );

  const data = useMemo(
    () => prepareTimeSeriesDataSeries(factTable),
    [factTable]
  );

  const yAxisTitle = useYAxisTitle(dataViewParams);
  const numberFormat = useNumberFormat(dataViewParams);

  return (
    <TimeSeriesChart
      groups={data}
      groupStyleMapping={groupStyleMapping}
      totalGroup={totalData ?? undefined}
      yAxisTitle={yAxisTitle}
      numberFormat={numberFormat}
    />
  );
}
