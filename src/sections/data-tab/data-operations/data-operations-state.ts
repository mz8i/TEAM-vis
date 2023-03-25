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

import { IDimPath } from '../../../data/dimension-paths';
import { LeafDimensionValue } from '../../../data/dimensions';
import { DataSelectionValue } from '../../../types/data';
import { activeTabContentState } from '../data-tab-state';

export const dataSelectionByDimPathState = atomFamily<
  DataSelectionValue<LeafDimensionValue>,
  IDimPath
>({
  key: 'dataSelectionByDimPath',
  default: selectorFamily({
    key: 'dataSelectionByDimPath/Default',
    get:
      (dimPath) =>
      ({ get }) => {
        /*
        // TODO: fix ops query
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
        */

        const primaryDimPaths = get(activeTabContentState).primarySelect;
        if (primaryDimPaths.includes(dimPath)) {
          return {
            aggregate: false,
            filter: null,
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
    const { primarySelect: primary, secondarySelect: secondary } = get(
      activeTabContentState
    );
    const all = [...primary, ...secondary];

    return Object.fromEntries(
      all.map((x) => {
        const val = get(dataSelectionByDimPathState(x));
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
