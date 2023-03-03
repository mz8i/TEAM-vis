import { array, bool, dict, nullable, object, string } from '@recoiljs/refine';
import { useEffect } from 'react';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { LeafDimensionValue } from '../../../data/tables/dimensions';
import { DataSelectionValue } from '../../../types/data';
import { activeTabState } from '../data-tab-state';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';

export class DimensionPath {
  public readonly dimension: string;
  public readonly joinList: string[];
  constructor(public readonly rawExpression: string) {
    const dims = rawExpression.split('.');

    this.dimension = dims[dims.length - 1];
    this.joinList = dims;
  }

  public toString() {
    return this.rawExpression;
  }
}

export const dimPathByDimExprState = selectorFamily({
  key: 'dimPathByDimExpr',
  get: (dimExpr: string) => () => {
    return new DimensionPath(dimExpr);
  },
});

export const currentPrimaryDimPathState = selector<
  DimensionPath | null | undefined
>({
  key: 'currentPrimaryDimPath',
  get: ({ get }) => {
    const {
      content: { primarySelect },
    } = get(activeTabState);
    if (primarySelect == null) {
      return null;
    } else {
      return get(dimPathByDimExprState(primarySelect));
    }
  },
});

export const currentSecondaryDimPathsState = selector<DimensionPath[]>({
  key: 'currentSecondaryDimPaths',
  get: ({ get }) => {
    const {
      content: { secondarySelect },
    } = get(activeTabState);

    return secondarySelect.map((expr) => get(dimPathByDimExprState(expr)));
  },
});

export const dataSelectionByDimExprState = atomFamily<
  DataSelectionValue<LeafDimensionValue>,
  string
>({
  key: 'dataSelectionByDimExpr',
  default: selectorFamily({
    key: 'dataSelectionByDimExpr/Default',
    get:
      (dimExpr) =>
      ({ get }) => {
        const dimPath = get(dimPathByDimExprState(dimExpr));
        const opsQuery = get(opsQueryState);
        if (dimExpr in opsQuery) {
          const dimensionStore = get(
            leafStoreByDimensionState(dimPath.dimension)
          );
          const queryObj = opsQuery[dimExpr];

          const filterValues: LeafDimensionValue[] | null =
            queryObj.filter
              ?.map((x) => dimensionStore.get(x, 'ID')!)
              .filter((x) => x != null) ?? null;

          const res = {
            aggregate: queryObj.aggregate,
            filter: filterValues,
          };

          return res;
        }
        const primaryDimPath = get(currentPrimaryDimPathState);
        if (dimPath.rawExpression === primaryDimPath?.rawExpression) {
          return {
            aggregate: false,
            filter: [],
          };
        } else {
          return {
            aggregate: true,
            filter: null,
          };
        }
      },
  }),
});

export const currentOpsParamsState = selector({
  key: 'currentOpsParams',
  get: ({ get }) => {
    const primary = get(currentPrimaryDimPathState);
    const secondary = get(currentSecondaryDimPathsState);
    const all = [...(primary ? [primary] : []), ...secondary];

    return Object.fromEntries(
      all.map((x) => {
        const val = get(dataSelectionByDimExprState(x.rawExpression));
        return [
          x.rawExpression,
          {
            aggregate: val.aggregate,
            filter: val.filter?.map((f) => f.ID),
          },
        ];
      })
    );
  },
});

export const opsQueryState = atom({
  key: 'opsQuery',
  default: {},
  effects: [
    urlSyncEffect({
      itemKey: 'ops',
      storeKey: 'json-url',
      refine: dict(
        object({ aggregate: bool(), filter: nullable(array(string())) })
      ),
      history: 'replace',
    }),
  ],
});

export function useSyncOpsQuery() {
  const opsParams = useRecoilValue(currentOpsParamsState);

  const setOpsQuery = useSetRecoilState(opsQueryState);

  useEffect(() => {
    setOpsQuery(opsParams);
  }, [opsParams, setOpsQuery]);
}
