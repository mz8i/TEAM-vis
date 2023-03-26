import { IDataFrame } from 'data-forge';

import { mapEntries } from '../../utils/helpers';
import { DomainStore } from '../dimensions';
import { DimensionMeta } from '../fetch/models/dimensions-meta';
import { getLinkedDimensionStores } from './linked-dimensions';

export function linkFactDimensions(
  factTable: IDataFrame<number, any>,
  dimensionsMetadata: Record<string, DimensionMeta>,
  getStore: (dim: string) => DomainStore
) {
  const columns = factTable.getColumnNames();
  const linkedStores = getLinkedDimensionStores(
    columns,
    dimensionsMetadata,
    getStore
  );

  return replaceLinkedDimensionsInDataFrame(factTable, linkedStores);
}

function replaceLinkedDimensionsInDataFrame(
  factTable: IDataFrame<number, any>,
  linkedStores: Record<string, { dimension: string; store: DomainStore }>
) {
  return factTable
    .generateSeries(
      mapEntries(linkedStores, ([column, { dimension, store }]) => [
        dimension,
        (row) => store.get(row[column], 'ID'),
      ])
    )
    .dropSeries(Object.keys(linkedStores));
}
