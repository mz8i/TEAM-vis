import { Typography } from '@mui/material';
import { ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CustomTooltip } from '../../CustomTooltip';
import { isFullOpacity, isHovered, isSelected } from '../../chart-utils';
import { CustomLegend } from '../../legend/CustomLegend';
import { DataSeries } from '../../types';

export interface YearValue {
  Year: number;
  Value: number;
}

export type TSDataSeries = DataSeries<YearValue>;

function processData(
  groups: TSDataSeries[],
  totalGroup: TSDataSeries | undefined
) {
  let minYear = +Infinity;
  let maxYear = -Infinity;

  const gKeys: string[] = [];
  const gLookups: Record<string, Record<number, number>> = {};

  const allGroups = [...groups];

  if (totalGroup) {
    allGroups.push(totalGroup);
  }

  for (const g of allGroups) {
    const lookup: Record<number, number> = (gLookups[g.GroupKey] = {});
    gKeys.push(g.GroupKey);

    for (const row of g.Rows) {
      const yr = row.Year;
      if (yr < minYear) minYear = yr;
      if (yr > maxYear) maxYear = yr;

      lookup[yr] = row.Value;
    }
  }

  const data: any[] = [];
  for (let yr = minYear; yr <= maxYear; yr++) {
    const obj: any = { Year: yr };

    for (const key of gKeys) {
      obj[key] = gLookups[key][yr] ?? 0;
    }

    data.push(obj);
  }

  return data;
}

export interface TimeSeriesChartProps {
  groups: TSDataSeries[];
  groupStyleMapping: (g: TSDataSeries) => any;
  numberFormat: (x: number) => string;
  totalGroup?: TSDataSeries;
  yAxisTitle?: ReactNode;
  yAxisNumberFormat?: (x: number) => string;
}

export const TimeSeriesChart = ({
  groups,
  groupStyleMapping,
  numberFormat,
  totalGroup,
  yAxisTitle,
  yAxisNumberFormat,
}: TimeSeriesChartProps) => {
  const keys = useMemo(() => groups.map((x) => x.GroupKey), [groups]);
  const data = useMemo(
    () => processData(groups, totalGroup),
    [groups, totalGroup]
  );

  const yearTicks = useMemo(
    () => data.map((x) => x.Year).filter((x) => x % 10 === 0),
    [data]
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (selectedKey && !keys.includes(selectedKey)) {
      setSelectedKey(null);
    }
  }, [selectedKey, keys, setSelectedKey]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <XAxis dataKey="Year" axisLine={false} ticks={yearTicks} />
        <YAxis
          width={120}
          axisLine={false}
          tickFormatter={yAxisNumberFormat ?? numberFormat}
        >
          <Label position="insideLeft" angle={-90}>
            {yAxisTitle}
          </Label>
        </YAxis>
        <CartesianGrid strokeDasharray="2 2" />
        <Tooltip
          content={
            <CustomTooltip
              renderHeader={(label) => (
                <Typography variant="subtitle2">Year: {label}</Typography>
              )}
              numberFormat={numberFormat}
            />
          }
        />

        {groups.map((group) => {
          const gkey = group.GroupKey;
          const hovered = isHovered(gkey, hoveredKey);
          const selected = isSelected(gkey, selectedKey);

          const isOpaque = isFullOpacity(hovered, selected);

          const fullOpacity = 0.9;
          const inactiveOpacity = 0.3;

          const style = groupStyleMapping(group);

          return (
            <Area
              key={group.GroupKey}
              dataKey={group.GroupKey}
              stackId="areas"
              name={group.GroupLabel}
              fillOpacity={isOpaque ? fullOpacity : inactiveOpacity}
              strokeOpacity={isOpaque ? fullOpacity : 0.5}
              strokeWidth={isOpaque ? 2 : 0}
              isAnimationActive={false}
              legendType="rect"
              {...style}
            />
          );
        })}
        {totalGroup && (
          <Line
            dataKey="Total"
            name={totalGroup.GroupLabel}
            strokeDasharray="5 5"
            stroke="black"
            dot={false}
            isAnimationActive={false}
          />
        )}

        <Legend
          wrapperStyle={{
            width: '250px',
            padding: '1em',
            minHeight: '90%', // magic number - 10% matches 30px x axis height
            maxHeight: '90%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            border: '1px solid #ddd',
          }}
          align="right"
          verticalAlign="top"
          layout="vertical"
          content={
            <CustomLegend
              hoveredKey={hoveredKey}
              setHoveredKey={setHoveredKey}
              selectedKey={selectedKey}
              setSelectedKey={setSelectedKey}
              payload={{} as any}
            />
          }
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
