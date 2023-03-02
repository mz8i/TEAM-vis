import { GetRecoilValue, selector, selectorFamily } from 'recoil';

import { loadJson } from '../../../data/load';
import {
  DimensionValue,
  DomainStore,
  InputDimensionValue,
  JoinDimensionValue,
  LeafDimensionValue,
  loadDimensionValues,
} from '../../../data/tables/dimensions';

interface DimensionMeta {
  Slug: string;
  Name: string;
  IsLeaf: boolean;
}
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
      const rawDimensions = await loadDimensionValues(dimension);

      const allMetadata = get(allDimensionsMetaState);
      const metadata = allMetadata[dimension];

      let processed: DimensionValue[];
      if (metadata.IsLeaf) {
        processed = rawDimensions.map(processLeafValue);
      } else {
        const columns = Object.keys(rawDimensions[0]);

        const otherStores = getLinkedDimensionStores(columns, allMetadata, get);

        processed = rawDimensions.map((raw) =>
          processJoinValue(raw, otherStores)
        );
      }

      const store = new DomainStore(
        processed,
        dimension,
        metadata.IsLeaf ? 'leaf' : 'join'
      );

      return store;
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

export function getLinkedDimensionStores(
  columns: string[],
  metadata: Record<string, DimensionMeta>,
  get: GetRecoilValue
) {
  const allDimensions = new Set(Object.keys(metadata));

  const dimensionIdCols = columns.filter((col) =>
    allDimensions.has(col.match(/^(.+)ID$/)?.[1] ?? '')
  );

  const otherStores = Object.fromEntries(
    dimensionIdCols.map((dimIdCol) => {
      const dim = dimFromIdColumn(dimIdCol);
      return [
        dimIdCol,
        {
          dimension: dim,
          store: get(domainStoreByDimensionState(dim)),
        },
      ];
    })
  );
  return otherStores;
}

function dimFromIdColumn(idColumn: string) {
  return idColumn.slice(0, idColumn.length - 2);
}

function processJoinValue(
  raw: InputDimensionValue,
  dimensionsByColumn: Record<string, { dimension: string; store: DomainStore }>
): JoinDimensionValue {
  const result: any = {};

  for (const [column, value] of Object.entries(raw)) {
    if (column in dimensionsByColumn) {
      const { dimension, store } = dimensionsByColumn[column];
      result[dimension] = store.get(value, 'ID');
    } else {
      result[column] = value;
    }
  }

  result.type = 'join';

  return result;
}

function processLeafValue(raw: InputDimensionValue): LeafDimensionValue {
  return {
    type: 'leaf' as const,
    ID: raw.ID,
    NA: raw.NA!,
    AB: raw.AB ?? raw.ID,
  };
}
