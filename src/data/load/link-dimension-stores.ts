import {
  DimensionMeta,
  DimensionValue,
  DomainStore,
  JoinDimensionValue,
  LeafDimensionValue,
} from '../dimensions';
import { InputDimensionValue } from '../fetch/tables/dimensions';
import { getLinkedDimensionStores } from './linked-dimensions';

export function loadDimensionStore(
  dimension: string,
  rawValues: InputDimensionValue[],
  allDimensionMeta: Record<string, DimensionMeta>,
  getStore: (dim: string) => DomainStore
) {
  const metadata = allDimensionMeta[dimension];

  let processed: DimensionValue[];
  if (metadata.IsLeaf) {
    processed = rawValues.map((x) => processLeafValue(x, metadata.Colors));
  } else {
    const columns = Object.keys(rawValues[0]);

    const otherStores = getLinkedDimensionStores(
      columns,
      allDimensionMeta,
      getStore
    );

    processed = rawValues.map((raw) => processJoinValue(raw, otherStores));
  }

  const store = new DomainStore(
    processed,
    dimension,
    metadata.IsLeaf ? 'leaf' : 'join',
    typeof metadata.Colors === 'object'
  );

  return store;
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

function processLeafValue(
  raw: InputDimensionValue,
  colors?: Record<string, string>
): LeafDimensionValue {
  const AB = raw.AB ?? raw.ID;

  return {
    type: 'leaf' as const,
    ID: raw.ID,
    NA: raw.NA!,
    AB,
    Description: raw.Description,
    Color: colors?.[AB] ?? raw.Color,
  };
}
