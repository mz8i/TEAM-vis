import { useRecoilValue } from 'recoil';

import { dataSourceByNameState } from '../data-source-state';
import { DataViewParams } from '../fact-state';

export function useYAxisTitle(dataViewParams: DataViewParams) {
  const {
    factTableParams: { variableName },
  } = dataViewParams;

  const dataSourceConfig = useRecoilValue(dataSourceByNameState(variableName));

  return dataSourceConfig.yAxisTitle;
}
