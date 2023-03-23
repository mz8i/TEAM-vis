import { DataFrame, IDataFrame } from 'data-forge';

import { interpolateDotFormatString } from '../../../utils/string-expression';
import { DimensionValue } from '../../dimensions';
import { ScenarioValue } from '../../scenario';
import { loadCsv } from '../load-file';
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

  const data = await loadCsv(filePath);
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
  let factTable: IDataFrame<number, any> | null = null;

  for (const scenario of scenarios) {
    const scenarioTable = await loadFactTable(dataSource, scenario, params);
    if (factTable == null) {
      factTable = scenarioTable;
    } else {
      factTable = factTable.concat(scenarioTable);
    }
  }
  return factTable!;
}
