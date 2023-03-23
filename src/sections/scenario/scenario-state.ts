import { string } from '@recoiljs/refine';
import { useLayoutEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ScenarioConfig } from '../../data/models/scenario';
import { leafStoreByDimensionState } from '../data-tab/dimensions/dimensions-state';

export const allScenariosState = selector<ScenarioConfig[]>({
  key: 'allScenarios',
  get: ({ get }) => get(leafStoreByDimensionState('Scenario')).values,
});

export const firstScenarioSlugState = selector<string>({
  key: 'firstScenarioSlug',
  get: ({ get }) => get(allScenariosState)?.[0].AB,
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

export const scenarioState = selector<ScenarioConfig>({
  key: 'scenario',
  get: ({ get }) => {
    const slug = get(scenarioSlugState);
    return get(allScenariosState).find((x) => x.AB === slug)!;
  },
});

export function useCheckScenarioSlug() {
  const [slug, setSlug] = useRecoilState(scenarioSlugState);

  const scenarios = useRecoilValue(allScenariosState);

  useLayoutEffect(() => {
    if (!scenarios.map((x) => x.AB).includes(slug)) {
      setSlug(scenarios[0].AB);
    }
  }, [scenarios, slug, setSlug]);
}
