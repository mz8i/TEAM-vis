import { selectorFamily } from 'recoil';

import {
  DomainStore,
  loadDimensionValues,
} from '../../../data/tables/dimensions';

export const allValuesByDimensionState = selectorFamily<DomainStore, string>({
  key: 'allValuesByDimension',
  get: (dimension: string) => () => {
    return loadDimensionValues(dimension);
  },
});
