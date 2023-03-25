import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { scenariosFilterState } from '../../scenario/scenario-state';
import { DataTabContentConfig, activeTabContentState } from '../data-tab-state';
import { FactTableParams } from '../fact-state';
import { paramValuesByVariableParamsState } from '../variables/variable-state';
import { useChartConfig, useChartViewParamSetter } from './use-chart';

export function SetDataDisplayParams() {
  return (
    <Suspense>
      <FactTableParamsSetter />
    </Suspense>
  );
}

function useFactTableParams(tabContent: DataTabContentConfig) {
  const {
    variable: { name, parameters },
  } = tabContent;
  const variableParams = useRecoilValue(
    paramValuesByVariableParamsState(parameters)
  );
  const scenarioFilter = useRecoilValue(scenariosFilterState);
  return {
    variableName: name,
    params: variableParams,
    scenarios: scenarioFilter,
  };
}

function FactTableParamsSetter() {
  const tabContent = useRecoilValue(activeTabContentState);

  const factTableParams: FactTableParams = useFactTableParams(tabContent);

  const chartConfig = useChartConfig(tabContent);
  const ViewParamsSetter = useChartViewParamSetter(chartConfig.type);

  return (
    <ViewParamsSetter
      factTableParams={factTableParams}
      tabContent={tabContent}
      chartConfig={chartConfig}
    />
  );
}
