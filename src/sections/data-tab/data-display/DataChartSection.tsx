import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRecoilValue } from 'recoil';

import { currentDataState } from '../data-state';
import { activeTabState } from '../data-tab-state';

export const DataChartSection = () => {
  const {
    content: { variable: variableConfig },
  } = useRecoilValue(activeTabState);

  const factTable = useRecoilValue(currentDataState);

  let i = 0;
  const table = factTable.toArray().map((x) => ({
    ...x,
    id: i++,
  }));

  const columns = factTable.getColumnNames();

  const colDefs: GridColDef[] = columns.map((k) => ({
    field: k,
    headerName: k,
    width: 150,
  }));

  return (
    <Box height="500px" width="1000px">
      <DataGrid key={variableConfig.name} columns={colDefs} rows={table} />
    </Box>
  );
};
