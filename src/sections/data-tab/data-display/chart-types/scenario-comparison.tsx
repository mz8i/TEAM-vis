import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { ScenarioComparisonChart } from '../../../../charts/chart-types/scenario-comparison/ScenarioComparisonChart';
import { prepareScenarioComparisonDataSeries } from '../../../../charts/chart-types/scenario-comparison/prepare-data';
import { makeScenarioComparisonChartConfig } from '../../../../charts/chart-types/scenario-comparison/scenario-comparison-config';
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
import { groupStyleMappingState } from '../data-style-state';

export const ScenarioComparisonDataViewParams = ({
  factTableParams,
  tabContent: { primarySelect, secondarySelect, operations: tabOps = {} },
}: {
  factTableParams: FactTableParams;
  tabContent: DataTabContentConfig;
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
    chartType: 'scenario-comparison',
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

  return (
    <ScenarioComparisonChart
      groups={data}
      groupStyleMapping={groupStyleMapping}
      scenarios={scenarios.values}
      years={[config.minYear, ...config.snapshotYears]}
    />
  );
}
