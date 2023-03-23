import { selectorFamily } from 'recoil';

import { DataSeries } from '../../../components/charts/types';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  DataViewIdParam,
  primaryFilteredTableState,
  primaryOpsState,
} from '../fact-state';

export const groupStyleMappingState = selectorFamily({
  key: 'groupStyleMapping',
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const primaryOp = get(primaryOpsState(dataViewId)).find(
        (x) => x.path.dimension !== 'Year' && !x.ops.aggregate
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
