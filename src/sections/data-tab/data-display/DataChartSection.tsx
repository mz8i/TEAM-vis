import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { useConcurrentValue } from '../../../utils/recoil/use-concurrent-value';
import {
  currentDataParamsState,
  currentDataState,
  makeGroupKeyFn,
  makeGroupObjFn,
} from '../data-state';
import { RechartsChart } from './charts/RechartsChart';
import { groupStyleMappingState } from './data-style-state';

export const DataChartSection = () => {
  const { value: dataViewParams, loadingNew } = useConcurrentValue(
    currentDataParamsState
  );
  const factTable = useRecoilValue(currentDataState(dataViewParams));

  const timeChartData = useMemo(() => {
    const groupColumns = factTable
      .getColumnNames()
      .filter((col) => !['Year', 'Value'].includes(col));

    const groupKeyFn = makeGroupKeyFn(groupColumns);
    const groupLabelFn = makeGroupKeyFn(groupColumns, ' - ', 'NA');
    const groupObjFn = makeGroupObjFn(groupColumns);

    return factTable
      .groupBy((row) => groupKeyFn(row))
      .select((group) => {
        const GroupKey = groupKeyFn(group.first());
        const GroupLabel = groupLabelFn(group.first());
        return {
          GroupKey,
          GroupLabel,
          Grouping: groupObjFn(group.first()),
          Rows: group.subset(['Year', 'Value']).toArray(),
        };
      })
      .toArray();
  }, [factTable]);

  const groupStyleMapping = useRecoilValue(
    groupStyleMappingState(dataViewParams)
  );

  return (
    <Box height="100%" position="relative" zIndex={0}>
      {loadingNew && (
        <Backdrop
          sx={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: 'rgba(220, 220, 220, 0.5)',
          }}
          open={true}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Backdrop>
      )}
      <RechartsChart
        groups={timeChartData}
        groupStyleMapping={groupStyleMapping}
      />
    </Box>
  );
};
