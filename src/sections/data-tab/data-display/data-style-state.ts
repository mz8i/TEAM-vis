import { selectorFamily } from 'recoil';

import {
  DataGroup,
  DataViewIdParam,
  primaryFilteredTableState,
  primaryOpsState,
} from '../data-state';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';

export const groupStyleMappingState = selectorFamily({
  key: 'groupStyleMapping',
  get:
    (dataViewId: DataViewIdParam) =>
    ({ get }) => {
      const primaryOp = get(primaryOpsState(dataViewId)).find(
        (x) => x.path.dimension !== 'Year'
      );

      if (primaryOp == null) return () => ({});

      const store = get(leafStoreByDimensionState(primaryOp.path.dimension));

      if (!primaryOp.ops.aggregate && store.hasColor) {
        return (g: DataGroup) => {
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
