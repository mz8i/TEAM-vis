import { Box } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PrimarySelect } from '../../../components/primary-select/PrimarySelect';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import { dataSelectionByDimPathState } from './data-operations-state';
import { DimensionPath } from './dimension-paths';

export const PrimarySelectSection: FC<{
  dimPaths: DimensionPath[];
}> = ({ dimPaths }) => {
  return (
    <Box height={40}>
      {dimPaths.map((dimPath) => (
        <Suspense key={dimPath.rawExpression}>
          <PrimarySubsection dimPath={dimPath} />
        </Suspense>
      ))}
    </Box>
  );
};

function PrimarySubsection({ dimPath }: { dimPath: DimensionPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimPathState(dimPath)
  );

  return (
    <Box>
      <PrimarySelect
        domain={values}
        value={selected}
        onChange={setSelected}
        getLabel={(x) => x.NA}
        allowAggregate={false}
      />
    </Box>
  );
}
