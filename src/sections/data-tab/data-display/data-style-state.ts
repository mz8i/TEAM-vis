import { selectorFamily } from 'recoil';

import { DataSeries } from '../../../charts/types';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import { ViewParams, primaryOpsState } from '../fact-ops-state';

export type GroupStyleMapping = (g: DataSeries<any>) => {};

export const groupStyleMappingState = selectorFamily<
  GroupStyleMapping,
  ViewParams
>({
  key: 'groupStyleMapping',
  get:
    (viewParams) =>
    ({ get }) => {
      const primaryOp = get(primaryOpsState(viewParams)).find(
        (x) =>
          !['Year', 'Scenario'].includes(x.path.dimension) && !x.ops.aggregate
      );

      if (primaryOp == null) return () => ({});

      const store = get(leafStoreByDimensionState(primaryOp.path.dimension));

      if (!primaryOp.ops.aggregate && store.hasColor) {
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
