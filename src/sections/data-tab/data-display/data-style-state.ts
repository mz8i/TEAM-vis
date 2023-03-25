import { selectorFamily } from 'recoil';

import { DataSeries } from '../../../charts/types';
import { DataOp } from '../../../data/transform/fact-processing';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  ViewParams,
  allGroupingsState,
  primaryOpsState,
} from '../fact-ops-state';

export type GroupStyleMapping = (g: DataSeries<any>) => {};

export const groupStyleMappingState = selectorFamily<
  GroupStyleMapping,
  ViewParams
>({
  key: 'groupStyleMapping',
  get:
    (viewParams) =>
    ({ get }) => {
      const groupingOps = get(allGroupingsState(viewParams)).filter(
        (x) => !['Year', 'Scenario'].includes(x.path.dimension)
      );

      const primaryOp = getDefaultColorDimension(groupingOps);

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
