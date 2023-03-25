import { useMemo } from 'react';
import { selectorFamily, useRecoilValue } from 'recoil';

import { TimeSeriesChart } from '../../../../charts/chart-types/time-series/TimeSeriesChart';
import { prepareTimeSeriesDataSeries } from '../../../../charts/chart-types/time-series/prepare-data';
import { ungroupTable } from '../../../../data/transform/fact-processing';
import { ConcurrentSetter } from '../../../../utils/recoil/ConcurrentSetter';
import { DataTabContentConfig } from '../../data-tab-state';
import { currentDataViewParamsState } from '../../data-view-state';
import {
  DataViewParams,
  FactTableParams,
  currentDataState,
  factTableState,
} from '../../fact-state';
import { groupStyleMappingState } from '../data-style-state';

const totalDataState = selectorFamily({
  key: 'totalData',
  dangerouslyAllowMutability: true,
  get:
    (dataViewId: DataViewParams) =>
    ({ get }) => {
      const table = get(factTableState(dataViewId.factTableParams));

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

export const TimeSeriesDataViewParams = ({
  factTableParams,
  tabContent: { primarySelect, secondarySelect, operations: tabOps = {} },
}: {
  factTableParams: FactTableParams;
  tabContent: DataTabContentConfig;
}) => {
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
    chartType: 'time-series',
  };

  return (
    <ConcurrentSetter
      state={currentDataViewParamsState}
      value={dataViewParams}
    />
  );
};

export function TimeSeriesDisplay({
  dataViewParams,
}: {
  dataViewParams: DataViewParams;
}) {
  const factTable = useRecoilValue(currentDataState(dataViewParams));
  const groupStyleMapping = useRecoilValue(
    groupStyleMappingState(dataViewParams.viewParams)
  );

  const data = useMemo(
    () => prepareTimeSeriesDataSeries(factTable),
    [factTable]
  );

  return (
    <TimeSeriesChart groups={data} groupStyleMapping={groupStyleMapping} />
  );
}
