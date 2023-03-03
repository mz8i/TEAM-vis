import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IDataFrame } from 'data-forge';

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

  return <DataGrid columns={colDefs} rows={table} />;
};
