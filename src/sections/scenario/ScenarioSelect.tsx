import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  allScenariosState,
  scenarioCompareState,
  scenarioSlugState,
} from './scenario-state';

export const ScenarioSelect = () => {
  const allScenarios = useRecoilValue(allScenariosState);

  const [scenarioSlug, setScenarioSlug] = useRecoilState(scenarioSlugState);
  const scenarioCompare = useRecoilValue(scenarioCompareState);

  return (
    <FormControl fullWidth disabled={scenarioCompare}>
      <InputLabel id="scenario-select-label">Scenario</InputLabel>
      <Tooltip
        title={
          scenarioCompare
            ? 'Turn scenario comparison off to view single scenario'
            : undefined
        }
        enterDelay={500}
        enterNextDelay={500}
        disableInteractive
      >
        <Select
          labelId="scenario-select-label"
          id="scenario-select"
          value={scenarioSlug}
          label="Scenario"
          onChange={(e) => setScenarioSlug(e.target.value)}
          variant="outlined"
          size="small"
        >
          {allScenarios.values.map((sc) => (
            <MenuItem key={sc.AB} value={sc.AB}>
              {sc.NA}
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </FormControl>
  );
};
