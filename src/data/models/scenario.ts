import {
  CheckerReturnType,
  array,
  number,
  object,
  string,
} from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../utils/recoil/refine';
import { LeafDimensionValue } from '../tables/dimensions';

export const scenarioChecker = object({
  id: number(),
  slug: string(),
  name: string(),
  description: string(),
});

export type ScenarioConfig = LeafDimensionValue;

export const allScenariosChecker = array(scenarioChecker);

export type AllScenariosConfig = MutableCheckerReturn<
  typeof allScenariosChecker
>;
