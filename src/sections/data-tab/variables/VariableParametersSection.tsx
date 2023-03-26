import { Box, Skeleton, Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { VariableConfig } from '../../../data/fetch/models/data-tab';
import { interpolateDotFormatString } from '../../../utils/string-expression';
import { dataSourceByNameState } from '../data-source-state';
import { ParamSelection } from './ParamSelection';

export const VariableParametersSection: FC<{
  variableConfig: VariableConfig;
}> = ({ variableConfig: { parameters, name } }) => {
  const dataSourceConfig = useRecoilValue(dataSourceByNameState(name));

  const paramSelections = Object.fromEntries(
    parameters.map((param) => [param, <ParamInlineInput param={param} />])
  );

  return (
    <Typography variant="body1">
      {interpolateDotFormatString(
        dataSourceConfig.title,
        paramSelections,
        'jsx'
      )}
    </Typography>
  );
};

function ParamInlineInput({ param }: { param: string }) {
  return (
    <Box display="inline-block" alignItems="start">
      <Suspense key={param} fallback={<Skeleton width={100} height="2em" />}>
        <ParamSelection dimension={param} />
      </Suspense>
    </Box>
  );
}
