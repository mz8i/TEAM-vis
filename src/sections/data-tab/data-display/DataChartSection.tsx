import { IDataFrame } from 'data-forge';
import { useMemo } from 'react';

import { makeGroupKeyFn, makeGroupObjFn } from '../data-state';
import { RechartsChart } from './charts/RechartsChart';

export const DataChartSection = ({ factTable }: { factTable: IDataFrame }) => {
  const timeChartData = useMemo(() => {
    const groupColumns = factTable
      .getColumnNames()
      .filter((col) => !['Year', 'Value'].includes(col));

    const groupKeyFn = makeGroupKeyFn(groupColumns);
    const groupLabelFn = makeGroupKeyFn(groupColumns, ' - ', 'NA');
    const groupObjFn = makeGroupObjFn(groupColumns);

    return factTable
      .groupBy((row) => groupKeyFn(row))
      .select((group) => {
        const GroupKey = groupKeyFn(group.first());
        const GroupLabel = groupLabelFn(group.first());
        return {
          GroupKey,
          GroupLabel,
          Grouping: groupObjFn(group.first()),
          Rows: group.subset(['Year', 'Value']).toArray(),
        };
      })
      .toArray();
  }, [factTable]);

  return <RechartsChart groups={timeChartData} />;
};
