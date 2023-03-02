import { DataFrame } from 'data-forge';

import { interpolateDotFormatString } from '../../utils/string-expression';
import { loadCsv } from '../load';
import { DataSourceConfig } from '../models/data-source';
import { ScenarioConfig } from '../models/scenario';
import { DimensionValue } from './dimensions';

export async function loadFactTable(
  dataSourceConfig: DataSourceConfig,
  scenario: ScenarioConfig,
  parameterValues: Record<string, DimensionValue>
): Promise<DataFrame> {
  const pathSchemaFormatted = interpolateDotFormatString(
    dataSourceConfig.pathSchema,
    parameterValues
  );

  const filePath = `data/tables/facts/${scenario.id}__${pathSchemaFormatted}.csv`;

  const data = await loadCsv(filePath);
  return new DataFrame(data);
}
