import { atom, selectorFamily } from 'recoil';

import {
  AllDataSourcesConfig,
  DataSourceConfig,
} from '../../data/fetch/models/data-source';

export const allDataSourcesState = atom<AllDataSourcesConfig>({
  key: 'allDataSources',
  default: new Promise(() => {}),
});

export const dataSourceByNameState = selectorFamily<DataSourceConfig, string>({
  key: 'dataSourceByName',
  get:
    (name) =>
    ({ get }) => {
      return get(allDataSourcesState)[name];
    },
});
