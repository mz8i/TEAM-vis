import { dict, string } from '@recoiljs/refine';
import _ from 'lodash';
import { useEffect } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { VariableConfig } from '../../../data/models/data-tab';
import { LeafDimensionValue } from '../../../data/tables/dimensions';
import { activeTabState } from '../data-tab-state';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';

export const paramsQueryState = atom<Record<string, string>>({
  key: 'paramsQuery',
  default: {},
  effects: [
    urlSyncEffect({
      itemKey: 'params',
      storeKey: 'json-url',
      refine: dict(string()),
      history: 'replace',
    }),
  ],
});

export const paramValueByDimensionState = atomFamily({
  key: 'paramValueByDimension',
  default: selectorFamily({
    key: 'paramValueByDimension/Default',
    get:
      (dimension: string) =>
      ({ get }) => {
        let value: LeafDimensionValue | undefined;
        const queryParams = get(paramsQueryState);

        if (dimension in queryParams) {
          value = get(leafStoreByDimensionState(dimension)).get(
            queryParams[dimension],
            'AB'
          );
        }

        if (value == null) {
          value = get(leafStoreByDimensionState(dimension)).values[0];
        }

        return value;
      },
  }),
});

export function useSaveViewParamsToUrl() {
  const {
    content: { variable },
  } = useRecoilValue(activeTabState);
  const params = useRecoilValue(paramsByVariableConfigState(variable));
  const setParamsQuery = useSetRecoilState(paramsQueryState);

  useEffect(() => {
    setParamsQuery(_.mapValues(params, (x) => x.AB));
  }, [params, setParamsQuery]);
}

export const paramsByVariableConfigState = selectorFamily<
  Record<string, LeafDimensionValue>,
  VariableConfig
>({
  key: 'paramsByVariableConfig',
  get:
    (variableConfig) =>
    ({ get }) => {
      return Object.fromEntries(
        variableConfig.parameters.map((p) => [
          p,
          get(paramValueByDimensionState(p)),
        ])
      );
    },
});
