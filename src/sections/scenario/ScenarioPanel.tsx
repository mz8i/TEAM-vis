import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';

import { ScenarioDescription } from './ScenarioDescription';
import { ScenarioSelect } from './ScenarioSelect';

export const ScenarioPanel = () => {
  return (
    <Box>
      <Typography variant="h5">Select Scenario</Typography>
      <Suspense>
        <Box my={2}>
          <ScenarioSelect />
        </Box>
        <Box my={2}>
          <ScenarioDescription />
        </Box>
      </Suspense>
    </Box>
  );
};
