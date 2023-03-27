import { DataFrame, IDataFrame } from 'data-forge';

import { interpolateDotFormatString } from '../../../utils/string-expression';
import { DimensionValue } from '../../dimensions';
import { ScenarioValue } from '../../scenario';
import { queryCsv } from '../load-file';
import { DataSourceConfig } from '../models/data-source';

export async function loadFactTable(
  dataSourceConfig: DataSourceConfig,
  scenario: ScenarioValue,
  parameterValues: Record<string, DimensionValue>
): Promise<IDataFrame> {
  const pathSchemaFormatted = interpolateDotFormatString(
    dataSourceConfig.pathSchema,
    parameterValues
  );

  const filePath = `data/tables/facts/${scenario.ID}__${pathSchemaFormatted}.csv`;

  const data = await queryCsv(filePath);
  return (
    new DataFrame(data)
      .generateSeries({
        Scenario: () => scenario,
      })
      // handle empty cells and convert to numbers
      .transformSeries({
        Value: (value) => (value === '' ? 0 : +value),
        Year: (value) => +value,
      })
  );
}

export async function loadMultiScenarioFactTable(
  dataSource: DataSourceConfig,
  scenarios: ScenarioValue[],
  params: Record<string, DimensionValue>
) {
  const scenarioTables: IDataFrame[] = [];

  for (const scenario of scenarios) {
    const table = await loadFactTable(dataSource, scenario, params);

    scenarioTables.push(table);
  }

  // CRUCIAL: reset index after concat!
  return DataFrame.concat(scenarioTables).resetIndex();
}
