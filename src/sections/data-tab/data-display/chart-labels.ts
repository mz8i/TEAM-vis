import { useRecoilValue } from 'recoil';

import { dataSourceByNameState } from '../data-source-state';
import { DataViewParams } from '../fact-state';

function useDataSourceConfig(dataViewParams: DataViewParams) {
  const {
    factTableParams: { variableName },
  } = dataViewParams;

  return useRecoilValue(dataSourceByNameState(variableName));
}
export function useYAxisTitle(dataViewParams: DataViewParams) {
  const dataSourceConfig = useDataSourceConfig(dataViewParams);

  return dataSourceConfig.yAxisTitle;
}

export function useNumberFormat(dataViewParams: DataViewParams) {
  const dataSourceConfig = useDataSourceConfig(dataViewParams);

  const nDigits = dataSourceConfig.numberFractionalDigits;
  const divisor = dataSourceConfig.numberDivisor;
  const divisorText = dataSourceConfig.numberDivisorText;

  return (x: number) => {
    const val = divisor == null ? x : x / divisor;
    const suffix = divisor == null ? '' : ` ${divisorText ?? ''}`;

    return (
      val.toLocaleString(undefined, {
        minimumFractionDigits: nDigits,
        maximumFractionDigits: nDigits,
        useGrouping: true,
      }) + suffix
    );
  };
}
