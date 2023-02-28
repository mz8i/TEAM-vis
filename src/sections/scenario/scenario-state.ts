import { string } from '@recoiljs/refine';
import { atom, selector } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { ScenarioConfig } from '../../data/models/scenario';

export const allScenariosState = atom<ScenarioConfig[]>({
  key: 'allScenarios',
  default: new Promise(() => {}),
});

export const firstScenarioSlugState = selector<string>({
  key: 'firstScenarioSlug',
  get: ({ get }) => get(allScenariosState)?.[0].slug,
});

export const scenarioSlugState = atom<string>({
  key: 'scenarioSlug',
  default: firstScenarioSlugState,
  effects: [
    urlSyncEffect({
      itemKey: 'scenario',
      refine: string(),
      history: 'replace',
      syncDefault: true,
    }),
  ],
});

export const scenarioState = selector<ScenarioConfig | undefined>({
  key: 'scenario',
  get: ({ get }) => {
    const slug = get(scenarioSlugState);
    return get(allScenariosState).find((x) => x.slug === slug);
  },
});
