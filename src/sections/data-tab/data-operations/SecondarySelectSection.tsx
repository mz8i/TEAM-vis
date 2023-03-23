import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import { DimensionPath } from '../../../data/dimension-paths';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import { metadataByDimensionState } from '../dimensions/dimensions-state';
import {
  currentDataParamsState,
  valuesAfterPrimaryFilterByPathState,
} from '../fact-state';
import { dataSelectionByDimPathState } from './data-operations-state';

export const SecondarySelectSection: FC<{
  dimPaths: DimensionPath[];
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

function SecondarySubsection({ dimPath }: { dimPath: DimensionPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;
  const currentDataViewId = useRecoilValue(currentDataParamsState);
  const allowedLoadable = useRecoilValueLoadable(
    valuesAfterPrimaryFilterByPathState({
      path: dimPath,
      dataViewId: currentDataViewId,
    })
  );

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimPathState(dimPath)
  );

  const title = useRecoilValue(metadataByDimensionState(dimension)).Name;

  const allowed =
    allowedLoadable.state === 'hasValue' ? allowedLoadable.contents : values;

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
