import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';

import { VariableConfig } from '../../../data/models/data-tab';
import { ParamSelection } from './ParamSelection';

export const VariableParametersSection: FC<{
  parameters: VariableConfig['parameters'];
}> = ({ parameters }) => {
  return (
    <Box height={50}>
      <Stack direction="row">
        {parameters.map((param) => (
          <Suspense fallback={null}>
            <ParamSelection key={param} dimension={param} />
          </Suspense>
        ))}
      </Stack>
    </Box>
  );
};
