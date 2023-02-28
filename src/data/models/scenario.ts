import {
  CheckerReturnType,
  array,
  number,
  object,
  string,
} from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../utils/recoil/refine';

export const scenarioChecker = object({
  id: number(),
  slug: string(),
  name: string(),
  description: string(),
});

export type ScenarioConfig = MutableCheckerReturn<typeof scenarioChecker>;

export const allScenariosChecker = array(scenarioChecker);

export type AllScenariosConfig = MutableCheckerReturn<
  typeof allScenariosChecker
>;
