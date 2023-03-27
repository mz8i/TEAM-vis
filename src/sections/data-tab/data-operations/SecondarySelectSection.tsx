import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';
import { selectorFamily, useRecoilState, useRecoilValue } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import { IDimPath, atPath } from '../../../data/dimension-paths';
import { LeafDimensionValue } from '../../../data/dimensions';
import { nullState } from '../../../utils/recoil/null-state';
import { currentDataViewParamsState } from '../data-view-state';
import {
  domainStoreByDimensionState,
  leafStoreByDimensionState,
  metadataByDimensionState,
} from '../dimensions/dimensions-state';
import { ViewParams } from '../fact-ops-state';
import { dataSelectionByDimPathState } from './data-operations-state';

export const SecondarySelectSection: FC<{
  dimPaths: IDimPath[];
}> = ({ dimPaths }) => {
  return (
    <Stack direction="row" spacing={1} height="100%">
      {dimPaths.map((path) => (
        <Suspense key={path.dimension}>
          <Box width={210} height="100%">
            <SecondarySubsection dimPath={path} />
          </Box>
        </Suspense>
      ))}
    </Stack>
  );
};

// TODO: handle without hardcoding Tech dimension
const allowedSecondaryAfterPrimaryState = selectorFamily({
  key: 'allowedSecondaryAfterPrimary',
  get:
    ({ path, viewParams }: { path: IDimPath; viewParams: ViewParams }) =>
    ({ get }) => {
      const field = viewParams.primarySelect[0];

      if (field == null || field.joinList[0] !== 'Tech') return null;

      const primarySelection = get(dataSelectionByDimPathState(field));

      const technologies = get(domainStoreByDimensionState('Tech')).values;
      const filteredTech = technologies.filter(
        (t) =>
          primarySelection.filter == null ||
          primarySelection.filter.includes(atPath({ Tech: t }, field))
      );

      return Array.from(
        new Set(filteredTech.map((t) => atPath({ Tech: t }, path)))
      ) as LeafDimensionValue[];
    },
});

function SecondarySubsection({ dimPath }: { dimPath: IDimPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimPathState(dimPath)
  );

  const title = useRecoilValue(metadataByDimensionState(dimension)).Name;

  const dataViewParams = useRecoilValue(currentDataViewParamsState);
  const allowed =
    useRecoilValue(
      selected.aggregate
        ? nullState
        : allowedSecondaryAfterPrimaryState({
            path: dimPath,
            viewParams: dataViewParams.viewParams,
          })
    ) ?? values;

  const shown = allowed;

  return (
    <SecondarySelect
      title={title}
      domain={{
        values,
        allowed,
        shown,
      }}
      value={selected}
      onValue={setSelected}
      getLabel={(x) => x.NA}
      getKey={(x) => `${x.ID}-${x.NA}`}
    />
  );
}
