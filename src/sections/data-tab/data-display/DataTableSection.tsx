import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IDataFrame } from 'data-forge';
import download from 'downloadjs';

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

export const DataTableSection = ({ factTable }: { factTable: IDataFrame }) => {
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
