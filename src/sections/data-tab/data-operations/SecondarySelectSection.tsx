import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import { domainStoreByDimensionState } from '../dimensions/dimensions-state';
import {
  DataFilter,
  dataSelectionByDimExprState,
} from './data-operations-state';

export const SecondarySelectSection: FC<{
  dataFilters: DataFilter[];
}> = ({ dataFilters }) => {
  return (
    <Box>
      <Stack direction="row">
        {dataFilters.map((dataFilter) => (
          <SecondarySubsection
            key={dataFilter.dimension}
            dataFilter={dataFilter}
          />
        ))}
      </Stack>
    </Box>
  );
};

function SecondarySubsection({ dataFilter }: { dataFilter: DataFilter }) {
  const dimension = dataFilter.dimension;
  const domainStore = useRecoilValue(domainStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimExprState(dataFilter.rawExpression)
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
