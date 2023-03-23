import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';

import { VariableConfig } from '../../../data/fetch/models/data-tab';
import { ParamSelection } from './ParamSelection';

export const VariableParametersSection: FC<{
  parameters: VariableConfig['parameters'];
}> = ({ parameters }) => {
  return (
    <Stack direction="row">
      {parameters.map((param) => (
        <Suspense key={param} fallback={null}>
          <ParamSelection dimension={param} />
        </Suspense>
      ))}
    </Stack>
  );
};
