import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { IDataFrame } from 'data-forge';
import download from 'downloadjs';
import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { useDataViewParamsConcurrent } from '../DataViewParamsContext';
import { currentDataState } from '../fact-state';

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

export const DataDownloadButton = () => {
  return (
    <Suspense
      fallback={
        <IconButton disabled={true} title="Loading data...">
          <Download />
        </IconButton>
      }
    >
      <DownloadButtonImpl />
    </Suspense>
  );
};

function DownloadButtonImpl() {
  const { value: currentDataParams, loadingNew } =
    useDataViewParamsConcurrent();

  const factTable = useRecoilValue(currentDataState(currentDataParams));
  return (
    <IconButton
      disabled={loadingNew}
      title="Download CSV with current data"
      onClick={() => {
        const data = prepareTableForCsv(factTable).toCSV();
        download(data, 'data.csv', 'text/csv');
      }}
    >
      <Download />
    </IconButton>
  );
}
