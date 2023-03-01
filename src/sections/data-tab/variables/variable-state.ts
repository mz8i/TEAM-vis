import { nullable, string } from '@recoiljs/refine';
import { atom, atomFamily, selectorFamily } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { VariableConfig } from '../../../data/models/data-tab';
import { DimensionValue } from '../../../data/tables/dimensions';
import { defaultValueByDimensionState } from '../dimensions/dimensions-state';

export const selectedVariableState = atom<string | null | undefined>({
  key: 'selectedVariable',
  default: null,
  effects: [
    urlSyncEffect({
      itemKey: 'var',
      refine: nullable(string()),
      history: 'replace',
    }),
  ],
});

export const paramValueByDimensionState = atomFamily({
  key: 'paramValueByDimension',
  default: defaultValueByDimensionState,
});

export const paramsByVariableConfigState = selectorFamily<
  Record<string, DimensionValue>,
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
