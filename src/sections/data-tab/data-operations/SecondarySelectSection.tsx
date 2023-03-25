import { Box, Stack } from '@mui/material';
import { FC, Suspense, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { SecondarySelect } from '../../../components/secondary-select/SecondarySelect';
import { IDimPath, atPath } from '../../../data/dimension-paths';
import { useConcurrentValue } from '../../../utils/recoil/use-concurrent-value';
import {
  leafStoreByDimensionState,
  metadataByDimensionState,
} from '../dimensions/dimensions-state';
import { DataViewParams, primaryFilteredTableState } from '../fact-state';
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

function useValuesAfterPrimaryFilter(
  path: IDimPath,
  dataViewParams: DataViewParams
) {
  const { value: primaryFilteredTable, loadingNew } = useConcurrentValue(
    primaryFilteredTableState(dataViewParams)
  );

  const allowedValues = useMemo(
    () =>
      primaryFilteredTable
        .deflate((row) => atPath(row, path))
        .distinct()
        .toArray(),
    [primaryFilteredTable]
  );

  return { allowedValues, loadingNew };
}

function SecondarySubsection({ dimPath }: { dimPath: IDimPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  // TODO: fix loading of allowed values

  // const dataViewParams = useRecoilValue(currentDataViewParamsState);
  // const { allowedValues, loadingNew } = useValuesAfterPrimaryFilter(
  //   dimPath,
  //   dataViewParams
  // );

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimPathState(dimPath)
  );

  const title = useRecoilValue(metadataByDimensionState(dimension)).Name;

  const allowed = values; // loadingNew ? values : allowedValues;

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
