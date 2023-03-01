import { Stack } from '@mui/material';
import { FC, Suspense } from 'react';

import { VariableConfig } from '../../../data/models/data-tab';
import { ParamSelection } from './ParamSelection';

export const VariableParametersSection: FC<{
  parameters: VariableConfig['parameters'];
}> = ({ parameters }) => {
  return (
    <Suspense fallback={null}>
      <Stack direction="row">
        {parameters.map((param) => (
          <ParamSelection key={param} dimension={param} />
        ))}
      </Stack>
    </Suspense>
  );
};
