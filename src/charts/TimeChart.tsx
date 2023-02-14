import { FC } from 'react';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryStack } from 'victory';

interface TimeChartDataGroupRow {
  Year: number;
  Value: number;
}

interface TimeChartDataGroup {
  Group: string;
  rows: TimeChartDataGroupRow[];
}

type TimeChartData = TimeChartDataGroup[];

export const TimeChart: FC<{ data: TimeChartData }> = ({ data }) => {
  return (
    <VictoryChart domainPadding={0}>
      <VictoryStack colorScale="warm">
        {data.map(({ Group, rows }) => (
          <VictoryArea data={rows} x="Year" y="Value" />
        ))}
        <VictoryAxis tickFormat={(x) => `${x}`} />
        <VictoryAxis dependentAxis />
      </VictoryStack>
    </VictoryChart>
  );
};
