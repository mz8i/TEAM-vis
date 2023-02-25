import { atom, selector } from 'recoil';

import { Scenario } from '../../data/models/scenario';

export const allScenariosState = atom<ReadonlyArray<Scenario>>({
  key: 'allScenarios',
  default: new Promise(() => void 0),
});

export const firstScenarioSlugState = selector<string>({
  key: 'firstScenarioSlug',
  get: ({ get }) => get(allScenariosState)?.[0].slug,
});

export const scenarioSlugState = atom<string>({
  key: 'scenarioSlug',
  default: firstScenarioSlugState,
});

export const scenarioState = selector<Scenario | undefined>({
  key: 'scenario',
  get: ({ get }) => {
    const slug = get(scenarioSlugState);
    return get(allScenariosState).find((x) => x.slug === slug);
  },
});
