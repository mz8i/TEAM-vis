import { useLayoutEffect } from 'react';
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';

import { DataSeries } from '../../../../charts/types';
import { DataOp } from '../../../../data/transform/fact-processing';
import { leafStoreByDimensionState } from '../../dimensions/dimensions-state';
import { ViewParams, allGroupingsState } from '../../fact-ops-state';

export type GroupStyleMapping = (g: DataSeries<any>) => {};

export const styleGroupsState = selectorFamily<DataOp[], ViewParams>({
  key: 'styleGroups',
  get:
    (viewParams) =>
    ({ get }) =>
      get(allGroupingsState(viewParams)).filter(
        (x) => !['Year', 'Scenario'].includes(x.path.dimension)
      ),
});

export const defaultStyleGroupState = selectorFamily({
  key: 'defaultStyleGroup',
  get:
    (viewParams: ViewParams) =>
    ({ get }) => {
      const styleGroups = get(styleGroupsState(viewParams));

      return getDefaultColorDimension(styleGroups);
    },
});

export const selectedStyleState = atomFamily({
  key: 'selectedStyle',
  default: defaultStyleGroupState,
});

export function useCheckDataStyle(viewParams: ViewParams) {
  const allowedGroups = useRecoilValue(styleGroupsState(viewParams));
  const selectedGroup = useRecoilValue(selectedStyleState(viewParams));
  const resetSelectedGroup = useResetRecoilState(
    selectedStyleState(viewParams)
  );

  useLayoutEffect(() => {
    if (!allowedGroups.includes(selectedGroup)) {
      resetSelectedGroup();
    }
  }, [allowedGroups, selectedGroup]);
}

export const groupStyleMappingState = selectorFamily<
  GroupStyleMapping,
  ViewParams
>({
  key: 'groupStyleMapping',
  get:
    (viewParams) =>
    ({ get }) => {
      const primaryOp = get(selectedStyleState(viewParams));

      if (primaryOp == null) return () => ({});

      const store = get(leafStoreByDimensionState(primaryOp.path.dimension));

      if (store.hasColor) {
        return (g: DataSeries<any>) => {
          const value = g.Grouping[primaryOp.path.rawExpression];
          const color = value?.Color ?? '#cccccc';
          return {
            fill: color,
            stroke: color,
          };
        };
      } else return () => ({});
    },
});

export function getDefaultColorDimension(allGroupings: DataOp[]): DataOp {
  return (
    allGroupings.find((x) => x.ops.filter == null || x.ops.filter.length > 1) ??
    allGroupings[0]
  );
}
