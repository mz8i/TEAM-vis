import { Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';

import { scenarioState } from './scenario-state';

export const ScenarioDescription = () => {
  const scenario = useRecoilValue(scenarioState);

  return scenario ? (
    <Typography variant="body1">{scenario.Description}</Typography>
  ) : null;
};
