import { DataFrame } from 'data-forge';
import { selector, selectorFamily } from 'recoil';

import { VariableConfig } from '../../data/models/data-tab';
import { ScenarioConfig } from '../../data/models/scenario';
import { loadFactTable } from '../../data/tables/facts';
import { scenarioState } from '../scenario/scenario-state';
import { dataSourceByNameState } from './data-source-state';
import { activeTabState } from './data-tab-state';
import { paramsByVariableConfigState } from './variables/variable-state';

export interface FactTableParams {
  variableConfig: VariableConfig;
  scenario: ScenarioConfig;
}

export const factTableState = selectorFamily<
  DataFrame,
  Readonly<FactTableParams>
>({
  key: 'factTable',
  get:
    ({ variableConfig, scenario }) =>
    ({ get }) => {
      const dataSource = get(dataSourceByNameState(variableConfig.name));
      const params = get(paramsByVariableConfigState(variableConfig));

      return loadFactTable(dataSource, scenario, params);
    },
});

export const currentDataState = selector({
  key: 'currentData',
  get: ({ get }) => {
    const scenario = get(scenarioState);
    const {
      content: { variable: variableConfig },
    } = get(activeTabState);

    return get(
      factTableState({
        scenario,
        variableConfig,
      })
    );
  },
});
