import { IDataFrame } from 'data-forge';
import { useMemo } from 'react';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryCursorContainerProps,
  VictoryStack,
  VictoryTooltip,
  VictoryVoronoiContainerProps,
  createContainer,
} from 'victory';

import { makeGroupKeyFn, makeGroupObjFn } from '../data-state';

const VictoryZoomVoronoiContainer = createContainer<
  VictoryCursorContainerProps,
  VictoryVoronoiContainerProps
>('cursor', 'voronoi');

export const DataChartSection = ({ factTable }: { factTable: IDataFrame }) => {
  const timeChartData = useMemo(() => {
    const groupColumns = factTable
      .getColumnNames()
      .filter((col) => !['Year', 'Value', 'GroupKey'].includes(col));

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
          Grouping: groupObjFn(group.first()),
          Rows: group
            .subset(['Year', 'Value'])
            .generateSeries({ GroupLabel: () => GroupLabel })
            .toArray(),
        };
      });
  }, [factTable]);

  return (
    <VictoryChart
      containerComponent={
        <VictoryZoomVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) =>
            datum ? `${datum.GroupLabel}: ${datum.Value}` : ''
          }
          labelComponent={
            <VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: 'white' }} />
          }
          cursorDimension="x"
        />
      }
    >
      <VictoryStack colorScale="warm">
        {timeChartData.map(({ GroupKey, Grouping, Rows }) => {
          return <VictoryArea key={GroupKey} data={Rows} x="Year" y="Value" />;
        })}
        <VictoryAxis tickFormat={(x) => `${x}`} />
        <VictoryAxis dependentAxis />
      </VictoryStack>
    </VictoryChart>
  );
};
