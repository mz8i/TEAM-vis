import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import {
  currentDataParamsState,
  valuesAfterPrimaryFilterByPathState,
} from '../data-state';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import { metadataByDimensionState } from '../dimensions/dimensions-state';
import { dataSelectionByDimPathState } from './data-operations-state';
import { DimensionPath } from './dimension-paths';

export const SecondarySelectSection: FC<{
  dimPaths: DimensionPath[];
}> = ({ dimPaths }) => {
  return (
    <Box>
      <Stack direction="row">
        {dimPaths.map((path) => (
          <Suspense>
            <SecondarySubsection key={path.dimension} dimPath={path} />
          </Suspense>
        ))}
      </Stack>
    </Box>
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
    />
  );
}
