import { FormControlLabel, Switch } from '@mui/material';
import { useRecoilState } from 'recoil';

import { scenarioCompareState } from './scenario-state';

export const ScenarioCompare = () => {
  const [compare, setCompare] = useRecoilState(scenarioCompareState);

  return (
    <FormControlLabel
      control={
        <Switch
          size="small"
          checked={compare}
          onChange={(e, checked) => setCompare(checked)}
        />
      }
      label="Compare"
      labelPlacement="start"
    />
  );
};
