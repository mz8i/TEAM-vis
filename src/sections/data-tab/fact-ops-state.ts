import { selectorFamily } from 'recoil';

import { IDimPath, makeDimPath } from '../../data/dimension-paths';
import { getGroupingsFromOps } from '../../data/transform/fact-processing';
import { DataSelectionValue } from '../../types/data';
import { dataSelectionByDimPathState } from './data-operations/data-operations-state';

export type ViewParams = {
  chartOps: Record<string, DataSelectionValue<any>>;
  tabOps: Record<string, DataSelectionValue<any>>;
  primarySelect: IDimPath[];
  secondarySelect: IDimPath[];
};

export const primaryOpsState = selectorFamily({
  key: 'primaryOps',
  get:
    ({ chartOps, tabOps, primarySelect }: ViewParams) =>
    ({ get }) => {
      const ops = [
        ...Object.entries(chartOps),
        ...Object.entries(tabOps),
        ...primarySelect.map(
          (dimPath) =>
            [dimPath, get(dataSelectionByDimPathState(dimPath))] as const
        ),
      ].map(([path, ops]) => ({
        path: makeDimPath(path),
        ops,
      }));

      return ops;
    },
});

export const secondaryOpsState = selectorFamily({
  key: 'secondaryOps',
  get:
    ({ secondarySelect }: ViewParams) =>
    ({ get }) => {
      const ops = secondarySelect.map((dimPath) => ({
        path: dimPath,
        ops: get(dataSelectionByDimPathState(dimPath)),
      }));

      return ops;
    },
});

export const allGroupingsState = selectorFamily({
  key: 'allGroupings',
  get:
    (viewParams: ViewParams) =>
    ({ get }) => {
      const allOps = [
        ...get(primaryOpsState(viewParams)),
        ...get(secondaryOpsState(viewParams)),
      ];

      return getGroupingsFromOps(allOps);
    },
});
