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

export const defaultValueByDimensionState = selectorFamily({
  key: 'defaultValueByDimension',
  get:
    (dimension: string) =>
    ({ get }) =>
      get(allValuesByDimensionState(dimension)).values[0],
});
