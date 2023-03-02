import { selectorFamily } from 'recoil';

import {
  DomainStore,
  loadDimensionValues,
} from '../../../data/tables/dimensions';

export const domainStoreByDimensionState = selectorFamily<DomainStore, string>({
  key: 'domainStoreByDimension',
  get: (dimension: string) => () => {
    return loadDimensionValues(dimension);
  },
});
