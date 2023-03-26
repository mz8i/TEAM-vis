import { atom, selectorFamily } from 'recoil';

import { DomainStore, LeafDimensionValue } from '../../../data/dimensions';
import { DimensionMeta } from '../../../data/fetch/models/dimensions-meta';
import { loadDimensionValues } from '../../../data/fetch/tables/dimensions';
import { loadDimensionStore } from '../../../data/load/link-dimension-stores';

export const allDimensionsMetaState = atom<Record<string, DimensionMeta>>({
  key: 'allDimensionsMeta',
  default: new Promise(() => {}),
});

export const metadataByDimensionState = selectorFamily({
  key: 'metadataByDimension',
  get:
    (dimension: string) =>
    ({ get }) =>
      get(allDimensionsMetaState)[dimension],
});

export const dimensionMetadataByListState = selectorFamily({
  key: 'dimensionMetadataByList',
  get:
    (dimensions: string[]) =>
    ({ get }) =>
      Object.fromEntries(
        dimensions.map((dim) => [dim, get(metadataByDimensionState(dim))])
      ),
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
