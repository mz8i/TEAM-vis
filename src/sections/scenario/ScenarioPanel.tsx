import { Box, Stack, Typography } from '@mui/material';
import { Suspense } from 'react';

import { ScenarioCompare } from './ScenarioCompare';
import { ScenarioDescription } from './ScenarioDescription';
import { ScenarioSelect } from './ScenarioSelect';

function Outline({ ...props }: any) {
  return (
    <Box
      border="1px solid gainsboro"
      borderRadius={2}
      py={3}
      px={1.5}
      {...props}
    />
  );
}

export const ScenarioPanel = () => {
  return (
    <Box position="relative">
      <Typography variant="h5">Scenario</Typography>
      <Suspense>
        <Box position="absolute" top={3} right={0}>
          <ScenarioCompare />
        </Box>
        <Outline mt={3} height="200px">
          <Stack direction="column" spacing={2}>
            <ScenarioSelect />
            <ScenarioDescription />
          </Stack>
        </Outline>
      </Suspense>
    </Box>
  );
};
