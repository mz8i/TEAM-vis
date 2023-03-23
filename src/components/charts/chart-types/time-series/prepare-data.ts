import { IDataFrame } from 'data-forge';

import {
  makeGroupKeyFn,
  makeGroupObjFn,
} from '../../../../data/transform/fact-processing';
import { TSDataSeries } from './TimeSeriesChart';

export function prepareTimeSeriesDataSeries(
  factTable: IDataFrame
): TSDataSeries[] {
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
}
