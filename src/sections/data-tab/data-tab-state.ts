import _ from 'lodash';
import { atom, selector, selectorFamily } from 'recoil';

import { DimensionPath, makeDimPath } from '../../data/dimension-paths';
import {
  DataTabConfigInput,
  TabContentConfig,
} from '../../data/fetch/models/data-tab';

export const allTabsState = atom<DataTabConfigInput[]>({
  key: 'allTabs',
  default: new Promise(() => {}),
});

type DataTabConfig = Omit<DataTabConfigInput, 'content'> & {
  content: Omit<TabContentConfig, 'primarySelect' | 'secondarySelect'> & {
    primarySelect: DimensionPath[];
    secondarySelect: DimensionPath[];
  };
};

function processTabState(state: DataTabConfigInput): DataTabConfig {
  const processed: DataTabConfig = _.cloneDeep(state) as any;

  const primary = state.content.primarySelect;
  processed.content.primarySelect =
    primary != null ? [makeDimPath(primary)] : [];
  processed.content.secondarySelect = state.content.secondarySelect.map((x) =>
    makeDimPath(x)
  );

  return processed;
}

export const tabBySlugState = selectorFamily<DataTabConfig, string>({
  key: 'tabBySlug',
  get:
    (slug) =>
    ({ get }) => {
      const tab = get(allTabsState).find((x) => x.slug === slug);

      if (tab == null) {
        throw new Error(`Data tab '${slug}' not found`);
      }

      return processTabState(tab);
    },
});

export const tabContentBySlugState = selectorFamily({
  key: 'tabContentBySlug',
  get:
    (slug: string) =>
    ({ get }) =>
      get(tabBySlugState(slug)).content,
});

export const activeTabSlugState = atom<string>({
  key: 'activeTabSlug',
  default: new Promise(() => {}),
});

export const activeTabContentState = selector({
  key: 'activeTabContent',
  get: ({ get }) => get(tabContentBySlugState(get(activeTabSlugState))),
});
