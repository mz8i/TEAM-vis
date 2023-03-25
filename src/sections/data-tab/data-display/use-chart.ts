import { ComponentType } from 'react';
import { useRecoilValue } from 'recoil';

import { ChartConfig } from '../../../data/fetch/models/data-tab';
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
  chartConfig: ChartConfig;
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

export function useChartConfig(tabContent: DataTabContentConfig): ChartConfig {
  const scenarioCompare = useRecoilValue(scenarioCompareState);

  if (scenarioCompare)
    return {
      type: 'scenario-comparison',
      options: {},
    };

  return (
    tabContent.defaultChart ?? {
      type: 'time-series',
      options: {},
    }
  );
}

export function useChartViewParamSetter(
  chartType: ChartType
): DataViewParamsSetterComponentType {
  return chartTypes[chartType].ViewParamsSetter;
}

export function useChartComponent(chartType: ChartType): ChartComponentType {
  return chartTypes[chartType].ChartComponent;
}
