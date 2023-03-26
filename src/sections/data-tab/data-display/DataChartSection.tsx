import { Backdrop, Box, CircularProgress } from '@mui/material';

import { useConcurrentValue } from '../../../utils/recoil/use-concurrent-value';
import { currentDataViewParamsState } from '../data-view-state';
import { DataStyleSelect } from './data-style/DataStyleSelect';
import { useChartComponent } from './use-chart';

export const DataChartSection = () => {
  const { value: dataViewParams, loadingNew } = useConcurrentValue(
    currentDataViewParamsState
  );

  const ChartComponent = useChartComponent(dataViewParams.chartConfig.type);

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
      <Box position="absolute" top={-50} right={1} width={250} m={0.5}>
        <DataStyleSelect viewParams={dataViewParams.viewParams} />
      </Box>
      <ChartComponent dataViewParams={dataViewParams} />
    </Box>
  );
};
