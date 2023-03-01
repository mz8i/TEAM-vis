import { interpolateDotFormatString } from '../../utils/string-expression';
import { loadCsv } from '../load';
import { DataSourceConfig } from '../models/data-source';
import { ScenarioConfig } from '../models/scenario';
import { DimensionValue } from './dimensions';

export async function loadFactTable(
  dataSourceConfig: DataSourceConfig,
  scenario: ScenarioConfig,
  parameterValues: Record<string, DimensionValue>
) {
  const pathSchemaFormatted = interpolateDotFormatString(
    dataSourceConfig.pathSchema,
    parameterValues
  );

  const filePath = `data/tables/facts/${scenario.id}__${pathSchemaFormatted}.csv`;

  const data = await loadCsv(filePath);

  let i = 0;
  const preprocessed = data.map((x: any) => ({
    id: i++,
    ...x,
  }));

  return preprocessed;
}
