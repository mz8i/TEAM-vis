import { Box, Skeleton, Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { VariableConfig } from '../../../data/fetch/models/data-tab';
import { interpolateDotFormatString } from '../../../utils/string-expression';
import {
  scenarioCompareState,
  scenarioState,
} from '../../scenario/scenario-state';
import { dataSourceByNameState } from '../data-source-state';
import { ParamSelection } from './ParamSelection';

export const VariableParametersSection: FC<{
  variableConfig: VariableConfig;
}> = ({ variableConfig: { parameters, name } }) => {
  const dataSourceConfig = useRecoilValue(dataSourceByNameState(name));

  const compareScenario = useRecoilValue(scenarioCompareState);
  const selectedScenario = useRecoilValue(scenarioState);

  const paramSelections = Object.fromEntries(
    parameters.map((param) => [
      param,
      <ParamInlineInput key={param} param={param} />,
    ])
  );

  return (
    <Typography variant="body1" component="div">
      {interpolateDotFormatString(
        dataSourceConfig.title,
        paramSelections,
        'jsx'
      )}{' '}
      &mdash;{' '}
      {compareScenario ? (
        <>Scenario Comparison</>
      ) : (
        <>Scenario: {selectedScenario.NA}</>
      )}
    </Typography>
  );
};

function ParamInlineInput({ param }: { param: string }) {
  return (
    <Box display="inline-block">
      <Suspense key={param} fallback={<Skeleton width={100} height="100%" />}>
        <ParamSelection dimension={param} />
      </Suspense>
    </Box>
  );
}
