import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';

import { allScenariosState, scenarioSlugState } from './scenario-state';

export const ScenarioSelect = () => {
  const allScenarios = useRecoilValue(allScenariosState);

  const [scenarioSlug, setScenarioSlug] = useRecoilState(scenarioSlugState);

  return (
    <FormControl fullWidth>
      <InputLabel id="scenario-select-label">Scenario</InputLabel>
      <Select
        labelId="scenario-select-label"
        id="scenario-select"
        value={scenarioSlug}
        label="Scenario"
        onChange={(e) => setScenarioSlug(e.target.value)}
        variant="outlined"
        size="small"
      >
        {allScenarios.map((sc) => (
          <MenuItem key={sc.slug} value={sc.slug}>
            {sc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
