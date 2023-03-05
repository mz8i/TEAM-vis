import { Download } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IDataFrame } from 'data-forge';
import download from 'downloadjs';
import { useRecoilValue } from 'recoil';

import { useConcurrentValue } from '../../../utils/recoil/use-concurrent-value';
import { currentDataParamsState, currentDataState } from '../data-state';

function prepareTableForCsv(table: IDataFrame) {
  const firstRow = table.first();

  const objColumns = table
    .getColumnNames()
    .filter((col) => typeof firstRow[col] === 'object');

  const mapping = Object.fromEntries(
    objColumns.map((col) => [col, (value: any) => value.NA])
  );

  return table.transformSeries(mapping);
}

export const DataTableSection = () => {
  const { value: currentDataParams, loadingNew } = useConcurrentValue(
    currentDataParamsState
  );
  const factTable = useRecoilValue(currentDataState(currentDataParams));

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
    valueGetter: ({ value }) => (typeof value === 'object' ? value.NA : value),
  }));

  return (
    <>
      {loadingNew && <Typography>(loading new data...)</Typography>}
      <IconButton
        onClick={() => {
          const data = prepareTableForCsv(factTable).toCSV();
          download(data, 'data.csv', 'text/csv');
        }}
      >
        <Download />
      </IconButton>
      <DataGrid columns={colDefs} rows={table} />
    </>
  );
};
