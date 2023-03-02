import { Box } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PrimarySelect } from '../../../components/primary-select/PrimarySelect';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  DimensionPath,
  dataSelectionByDimExprState,
} from './data-operations-state';

export const PrimarySelectSection: FC<{
  dimPath: DimensionPath;
}> = ({ dimPath }) => {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimExprState(dimPath.rawExpression)
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
};
