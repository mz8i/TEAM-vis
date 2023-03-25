import { IDataFrame } from 'data-forge';

import { ScenarioValue } from '../../../data/scenario';
import {
  groupTable,
  makeGroupKeyFn,
  makeGroupObjFn,
} from '../../../data/transform/fact-processing';
import { ScenarioDataSeries } from './ScenarioComparisonChart';

export function prepareScenarioComparisonDataSeries(
  factTable: IDataFrame
): ScenarioDataSeries[] {
  const valueColumns = ['Year', 'Value', 'Scenario'];
  const valueTransforms = {
    Scenario: (s: ScenarioValue) => s.NA,
  };

  const groupColumns = factTable
    .getColumnNames()
    .filter((col) => !valueColumns.includes(col));

  const groupKeyFn = makeGroupKeyFn(groupColumns);
  const groupObjFn = makeGroupObjFn(groupColumns);

  const groupRowsFn = (rr: IDataFrame) =>
    rr.subset(valueColumns).transformSeries(valueTransforms).toArray();

  const groupLabelFn = makeGroupKeyFn(groupColumns, ' - ', 'NA');

  return groupTable(factTable, groupKeyFn, groupObjFn, groupRowsFn)
    .generateSeries({
      GroupLabel: ({ Grouping }) => groupLabelFn(Grouping),
    })
    .toArray();
}
