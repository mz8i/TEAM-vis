import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { ScenarioComparisonChart } from '../../../../charts/chart-types/scenario-comparison/ScenarioComparisonChart';
import { prepareScenarioComparisonDataSeries } from '../../../../charts/chart-types/scenario-comparison/prepare-data';
import { makeScenarioComparisonChartConfig } from '../../../../charts/chart-types/scenario-comparison/scenario-comparison-config';
import { ChartConfig } from '../../../../data/fetch/models/data-tab';
import { useConfig } from '../../../../root-state';
import { ConcurrentSetter } from '../../../../utils/recoil/ConcurrentSetter';
import { allScenariosState } from '../../../scenario/scenario-state';
import { DataTabContentConfig } from '../../data-tab-state';
import { currentDataViewParamsState } from '../../data-view-state';
import {
  DataViewParams,
  FactTableParams,
  currentDataState,
} from '../../fact-state';
import { useNumberFormat, useYAxisTitle } from '../chart-labels';
import { groupStyleMappingState } from '../data-style/data-style-state';

export const ScenarioComparisonDataViewParams = ({
  factTableParams,
  tabContent: { primarySelect, secondarySelect, operations: tabOps = {} },
  chartConfig,
}: {
  factTableParams: FactTableParams;
  tabContent: DataTabContentConfig;
  chartConfig: ChartConfig;
}) => {
  const config = useConfig();

  const { operations: chartOps } = makeScenarioComparisonChartConfig(config);

  const dataViewParams: DataViewParams = {
    factTableParams,
    viewParams: {
      primarySelect,
      secondarySelect,
      tabOps,
      chartOps,
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

export function ScenarioComparisonDisplay({
  dataViewParams,
}: {
  dataViewParams: DataViewParams;
}) {
  const factTable = useRecoilValue(currentDataState(dataViewParams));
  const scenarios = useRecoilValue(allScenariosState);
  const groupStyleMapping = useRecoilValue(
    groupStyleMappingState(dataViewParams.viewParams)
  );

  const data = useMemo(
    () => prepareScenarioComparisonDataSeries(factTable),
    [factTable]
  );

  const config = useConfig();

  const yAxisTitle = useYAxisTitle(dataViewParams);
  const numberFormat = useNumberFormat(dataViewParams);
  const yAxisNumberFormat = useNumberFormat(dataViewParams, 'axis');

  return (
    <ScenarioComparisonChart
      groups={data}
      groupStyleMapping={groupStyleMapping}
      scenarios={scenarios.values}
      years={[config.minYear, ...config.snapshotYears]}
      yAxisTitle={yAxisTitle}
      numberFormat={numberFormat}
      yAxisNumberFormat={yAxisNumberFormat}
    />
  );
}
