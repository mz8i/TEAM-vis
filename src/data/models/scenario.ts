import {
  CheckerReturnType,
  array,
  number,
  object,
  string,
} from '@recoiljs/refine';

export const scenarioChecker = object({
  id: number(),
  slug: string(),
  name: string(),
  description: string(),
});

export type Scenario = CheckerReturnType<typeof scenarioChecker>;

export const allScenariosChecker = array<Scenario>(scenarioChecker);
