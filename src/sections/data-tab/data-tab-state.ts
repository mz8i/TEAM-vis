import { atom, selector, selectorFamily } from 'recoil';

import { DataTabConfig, VariableConfig } from '../../data/models/data-tab';
import { ScenarioConfig } from '../../data/models/scenario';
import { loadFactTable } from '../../data/tables/facts';
import { dataSourceByNameState } from './data-source-state';
import { paramsByVariableConfigState } from './variables/variable-state';

export const allTabsState = atom<DataTabConfig[]>({
  key: 'allTabs',
  default: new Promise(() => {}),
});

export const tabBySlugState = selectorFamily<DataTabConfig, string>({
  key: 'tabBySlug',
  get:
    (slug) =>
    ({ get }) => {
      const tab = get(allTabsState).find((x) => x.slug === slug);

      if (tab == null) {
        throw new Error(`Data tab '${slug}' not found`);
      }

      return tab;
    },
});

export const activeTabSlugState = atom<string>({
  key: 'activeTabSlug',
  default: new Promise(() => {}),
});

export const activeTabState = selector({
  key: 'activeTab',
  get: ({ get }) => get(tabBySlugState(get(activeTabSlugState))),
});

export interface FactTableParams {
  variableConfig: VariableConfig;
  scenario: ScenarioConfig;
}

export const factTableState = selectorFamily<any, Readonly<FactTableParams>>({
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
  get: ({ get }) => {},
});
