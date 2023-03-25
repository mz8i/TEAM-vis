import { ComponentType } from 'react';
import { useRecoilValue } from 'recoil';

import { scenarioCompareState } from '../../scenario/scenario-state';
import { DataTabContentConfig } from '../data-tab-state';
import { DataViewParams, FactTableParams } from '../fact-state';
import { ChartType } from './chart-types';
import {
  ScenarioComparisonDataViewParams,
  ScenarioComparisonDisplay,
} from './chart-types/scenario-comparison';
import {
  TimeSeriesDataViewParams,
  TimeSeriesDisplay,
} from './chart-types/time-series';

export type ChartComponentType = ComponentType<{
  dataViewParams: DataViewParams;
}>;

export type DataViewParamsSetterComponentType = ComponentType<{
  factTableParams: FactTableParams;
  tabContent: DataTabContentConfig;
}>;

export type ChartMeta = {
  ChartComponent: ChartComponentType;
  ViewParamsSetter: DataViewParamsSetterComponentType;
};

const chartTypes: Record<ChartType, ChartMeta> = {
  'time-series': {
    ChartComponent: TimeSeriesDisplay,
    ViewParamsSetter: TimeSeriesDataViewParams,
  },
  'scenario-comparison': {
    ChartComponent: ScenarioComparisonDisplay,
    ViewParamsSetter: ScenarioComparisonDataViewParams,
  },
};

export function useChartType(): ChartType {
  const scenarioCompare = useRecoilValue(scenarioCompareState);

  if (scenarioCompare) return 'scenario-comparison';

  return 'time-series';
}

export function useChartViewParamSetter(
  chartType: ChartType
): DataViewParamsSetterComponentType {
  return chartTypes[chartType].ViewParamsSetter;
}

export function useChartComponent(chartType: ChartType): ChartComponentType {
  return chartTypes[chartType].ChartComponent;
}
