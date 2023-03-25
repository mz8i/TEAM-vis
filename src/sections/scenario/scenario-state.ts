import { string, bool } from '@recoiljs/refine';
import { useLayoutEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ScenarioValue } from '../../data/scenario';
import { leafStoreByDimensionState } from '../data-tab/dimensions/dimensions-state';

export const allScenariosState = selector({
  key: 'allScenarios',
  get: ({ get }) => get(leafStoreByDimensionState('Scenario')),
});

export const firstScenarioSlugState = selector<string>({
  key: 'firstScenarioSlug',
  get: ({ get }) => get(allScenariosState)?.values[0].AB,
});

export const scenarioSlugState = atom<string>({
  key: 'scenarioSlug',
  default: firstScenarioSlugState,
  effects: [
    urlSyncEffect({
      itemKey: 'scenario',
      storeKey: 'simple-url',
      refine: string(),
      history: 'replace',
    }),
  ],
});

export const scenarioCompareState = atom<boolean>({
  key: 'scenarioCompare',
  default: false,
  effects: [
    urlSyncEffect({
      itemKey: 'compare',
      storeKey: 'simple-url',
      refine: bool(),
      history: 'push',
    }),
  ],
});

export const scenarioState = selector<ScenarioValue>({
  key: 'scenario',
  get: ({ get }) => {
    const slug = get(scenarioSlugState);
    return get(allScenariosState).get(slug, 'AB')!;
  },
});

export const scenariosFilterState = selector<ScenarioValue[]>({
  key: 'scenariosFilter',
  get: ({ get }) => {
    if (get(scenarioCompareState)) {
      return get(allScenariosState).values;
    } else {
      return [get(scenarioState)];
    }
  },
});

export function useCheckScenarioSlug() {
  const [slug, setSlug] = useRecoilState(scenarioSlugState);

  const scenarios = useRecoilValue(allScenariosState);
  const firstScenarioSlug = useRecoilValue(firstScenarioSlugState);

  useLayoutEffect(() => {
    if (scenarios.get(slug, 'AB') == null) {
      setSlug(firstScenarioSlug);
    }
  }, [scenarios, slug, setSlug]);
}
