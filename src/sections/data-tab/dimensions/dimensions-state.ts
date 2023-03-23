import { selector, selectorFamily } from 'recoil';

import {
  DimensionMeta,
  DomainStore,
  LeafDimensionValue,
} from '../../../data/dimensions';
import { loadJson } from '../../../data/fetch/load-file';
import { loadDimensionValues } from '../../../data/fetch/tables/dimensions';
import { loadDimensionStore } from '../../../data/load/link-dimension-stores';

export const allDimensionsMetaState = selector({
  key: 'allDimensionsMeta',
  get: () =>
    loadJson<Record<string, DimensionMeta>>('/config/dimensions-meta.json', {}),
});

export const metadataByDimensionState = selectorFamily({
  key: 'metadataByDimension',
  get:
    (dimension: string) =>
    ({ get }) =>
      get(allDimensionsMetaState)[dimension],
});

export const domainStoreByDimensionState = selectorFamily<DomainStore, string>({
  key: 'domainStoreByDimension',
  get:
    (dimension: string) =>
    async ({ get }) => {
      const allMetadata = get(allDimensionsMetaState);
      const getStore: (dim: string) => DomainStore = (dim: string) =>
        get(domainStoreByDimensionState(dim));

      const rawValues = await loadDimensionValues(dimension);

      return await loadDimensionStore(
        dimension,
        rawValues,
        allMetadata,
        getStore
      );
    },
});

export const leafStoreByDimensionState = selectorFamily<
  DomainStore<LeafDimensionValue>,
  string
>({
  key: 'leafStoreByDimension',
  get:
    (dimension) =>
    ({ get }) => {
      const store = get(domainStoreByDimensionState(dimension));

      if (store.type !== 'leaf') {
        throw new Error(
          `Requested dimension is not a leaf dimension: ${dimension}`
        );
      }

      return store as DomainStore<LeafDimensionValue>;
    },
});
