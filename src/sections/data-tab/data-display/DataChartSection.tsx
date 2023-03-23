import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { TimeSeriesChart } from '../../../components/charts/chart-types/time-series/TimeSeriesChart';
import { prepareTimeSeriesDataSeries } from '../../../components/charts/chart-types/time-series/prepare-data';
import { useConcurrentValue } from '../../../utils/recoil/use-concurrent-value';
import {
  FactTableParams,
  currentDataParamsState,
  currentDataState,
} from '../fact-state';
import { groupStyleMappingState } from './data-style-state';

export const DataChartSection = () => {
  const { value: dataViewParams, loadingNew } = useConcurrentValue(
    currentDataParamsState
  );

  const groupedSeriesData = useTimeSeriesData(dataViewParams);

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
      <TimeSeriesChart
        groups={groupedSeriesData}
        groupStyleMapping={groupStyleMapping}
      />
    </Box>
  );
};

function useTimeSeriesData(dataViewParams: FactTableParams) {
  const factTable = useRecoilValue(currentDataState(dataViewParams));

  return useMemo(() => prepareTimeSeriesDataSeries(factTable), [factTable]);
}
