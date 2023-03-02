import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  DimensionPath,
  dataSelectionByDimExprState,
} from './data-operations-state';

export const SecondarySelectSection: FC<{
  dimPaths: DimensionPath[];
}> = ({ dimPaths }) => {
  return (
    <Box>
      <Stack direction="row">
        {dimPaths.map((path) => (
          <SecondarySubsection key={path.dimension} dimPath={path} />
        ))}
      </Stack>
    </Box>
  );
};

function SecondarySubsection({ dimPath }: { dimPath: DimensionPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimExprState(dimPath.rawExpression)
  );

  return (
    <Box>
      <SecondarySelect
        title={dimension}
        domain={{
          values,
          allowed: values,
        }}
        value={selected}
        onValue={setSelected}
        getLabel={(x) => x.NA}
      />
    </Box>
  );
}
