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

export type NumberFormatContext = 'axis' | 'default';

export function useNumberFormat(
  dataViewParams: DataViewParams,
  ctx: NumberFormatContext = 'default'
) {
  const dataSourceConfig = useDataSourceConfig(dataViewParams);

  const nDigits = dataSourceConfig.numberFractionalDigits;
  const axisNDigits = dataSourceConfig.yAxisFractionalDigits ?? nDigits;
  const divisor = dataSourceConfig.numberDivisor;
  const divisorText = dataSourceConfig.numberDivisorText;

  return (x: number) => {
    const digits = ctx === 'axis' ? axisNDigits : nDigits;
    const val = divisor == null ? x : x / divisor;
    const suffix = divisor == null ? '' : ` ${divisorText ?? ''}`;

    console.log(ctx, digits, val, suffix);
    return (
      val.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: true,
      }) + suffix
    );
  };
}
