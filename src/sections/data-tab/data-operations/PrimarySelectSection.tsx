import { Box } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PrimarySelect } from '../../../components/primary-select/PrimarySelect';
import { domainStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  DataFilter,
  dataSelectionByDimExprState,
} from './data-operations-state';

export const PrimarySelectSection: FC<{
  dataFilter: DataFilter;
}> = ({ dataFilter }) => {
  const dimension = dataFilter.dimension;
  const domainStore = useRecoilValue(domainStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimExprState(dataFilter.rawExpression)
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
