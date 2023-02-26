import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';

import { ScenarioDescription } from './ScenarioDescription';
import { ScenarioSelect } from './ScenarioSelect';

export const ScenarioPanel = () => {
  return (
    <Box>
      <Typography variant="h4">Scenario Selection</Typography>

      <Suspense fallback="Loading scenarios...">
        <ScenarioSelect />
        <ScenarioDescription />
      </Suspense>
    </Box>
  );
};
