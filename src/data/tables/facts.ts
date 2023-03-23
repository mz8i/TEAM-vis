import { DataFrame, IDataFrame } from 'data-forge';

import { interpolateDotFormatString } from '../../utils/string-expression';
import { loadCsv } from '../load';
import { DataSourceConfig } from '../models/data-source';
import { ScenarioValue } from '../models/scenario';
import { DimensionValue } from './dimensions';

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
  return new DataFrame(data).generateSeries({
    Scenario: () => scenario,
  });
}
