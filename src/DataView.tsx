import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { readCSV, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { DataFrame } from 'danfojs/dist/danfojs-base';
import { TimeChart } from './charts/TimeChart';
import _ from 'lodash';

function processData(df: DataFrame) {
  const processed = df
    .query(
      df['VehCatNA']
        .eq('Total')
        .and(df['VehTypeNA'].eq('Car'))
        .and(df['FuelNA'].eq('Gasoline').or(df['FuelNA'].eq('Electricity')))
    )
    .groupby(['Year', 'VehTypeNA', 'FuelNA'])
    .agg({ NumVeh: 'sum' })
    .rename({ NumVeh_sum: 'Value' })
    .loc({ columns: ['Year', 'VehTypeNA', 'FuelNA', 'Value'] });

  const json: any = toJSON(processed)!;

  const res = _(json)
    .groupBy((x) => `${x.VehTypeNA} - ${x.FuelNA}`)
    .map((value, key) => ({ Group: key, rows: value }))
    .value();

  return res;
}

export const DataView = () => {
  const { data: df } = useSWR('/data/veh_stock.csv', readCSV);

  const data: any = useMemo(() => {
    return df ? processData(df) : null;
  }, [df]);

  return (
    <>{data && <TimeChart data={data} />}</>
    // <div id="data-table"></div>
    // <code>
    //   <pre style={{ width: '800px', textAlign: 'left' }}>{df?.as}</pre>
    // </code>
  );
};
