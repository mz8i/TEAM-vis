import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRecoilValue } from 'recoil';

import { scenarioState } from '../../scenario/scenario-state';
import { activeTabState, factTableState } from '../data-tab-state';

export const DataChartSection = () => {
  const scenario = useRecoilValue(scenarioState);
  const {
    content: { variable: variableConfig },
  } = useRecoilValue(activeTabState);

  const factTable = useRecoilValue(
    factTableState({
      scenario,
      variableConfig,
    })
  );

  const columns: GridColDef[] = Object.keys(factTable[0]).map((k) => ({
    field: k,
    headerName: k,
    width: 150,
  }));

  return (
    <Box height="500px" width="1000px">
      <DataGrid key={variableConfig.name} columns={columns} rows={factTable} />
    </Box>
  );
};
