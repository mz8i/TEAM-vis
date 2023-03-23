import { IDataFrame } from 'data-forge';

import { mapEntries } from '../../utils/helpers';
import {
  DimensionMeta,
  DimensionValue,
  DomainStore,
  JoinDimensionValue,
  LeafDimensionValue,
} from '../dimensions';
import { InputDimensionValue } from '../fetch/tables/dimensions';

export function getLinkedDimensionStores(
  columns: string[],
  metadata: Record<string, DimensionMeta>,
  getStore: (dim: string) => DomainStore
) {
  const linkedDimensions = getLinkedDimensions(columns, metadata);
  return getLinkedStorePerDimensionCol(linkedDimensions, getStore);
}

function getLinkedDimensions(
  columns: string[],
  metadata: Record<string, DimensionMeta>
) {
  const allDimensions = new Set(Object.keys(metadata));
  const dimensionIdCols = getDimensionIdCols(columns, allDimensions);

  return dimensionIdCols.map((col) => dimFromIdColumn(col));
}

function getLinkedStorePerDimensionCol(
  dimensions: string[],
  getStore: (dim: string) => DomainStore
) {
  return Object.fromEntries(
    dimensions.map((dim) => [
      idColumnFromDim(dim),
      {
        dimension: dim,
        store: getStore(dim),
      },
    ])
  );
}

function getDimensionIdCols(columns: string[], allDimensions: Set<string>) {
  const idColumnRegex = /^(.+)ID$/;
  return columns.filter((col) => {
    const nameWithoutId = col.match(idColumnRegex)?.[1];

    if (nameWithoutId == null) return false;

    return allDimensions.has(nameWithoutId);
  });
}

function idColumnFromDim(dim: string) {
  return dim + 'ID';
}

function dimFromIdColumn(idColumn: string) {
  return idColumn.slice(0, idColumn.length - 2);
}
