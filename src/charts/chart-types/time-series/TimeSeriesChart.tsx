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
  const allGroups = useMemo(() => {
    const ag = [...groups];
    if (totalGroup != null) {
      ag.push(totalGroup);
    }
    return ag;
  }, [groups, totalGroup]);

  const keys = useMemo(() => allGroups.map((x) => x.GroupKey), [allGroups]);
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
  const [chartHoveredKey, setChartHoveredKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (selectedKey && !keys.includes(selectedKey)) {
      setSelectedKey(null);
    }
  }, [selectedKey, keys, setSelectedKey]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} onClick={() => setSelectedKey(null)}>
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
              key={gkey}
              dataKey={gkey}
              stackId="areas"
              name={group.GroupLabel}
              fillOpacity={isOpaque ? fullOpacity : inactiveOpacity}
              strokeOpacity={isOpaque ? fullOpacity : 0.5}
              strokeWidth={isOpaque ? 2 : 0.5}
              isAnimationActive={false}
              legendType="rect"
              onMouseEnter={(e) => setChartHoveredKey(gkey)}
              onMouseLeave={(e) => setChartHoveredKey(null)}
              onClick={
                ((_: any, e: any) => {
                  setSelectedKey(gkey === selectedKey ? null : gkey);
                  e.stopPropagation();
                }) as any
              }
              activeDot={false}
              fill={isOpaque ? style.fill : '#aaaaaa'}
              stroke={isOpaque ? style.stroke : '#aaaaaa'}
            />
          );
        })}
        {totalGroup &&
          (() => {
            const group = totalGroup;
            const gkey = group.GroupKey;
            const hovered = isHovered(gkey, hoveredKey);
            const selected = isSelected(gkey, selectedKey);

            const isOpaque = isFullOpacity(hovered, selected);

            const fullOpacity = 0.9;

            return (
              <Line
                dataKey="Total"
                name={totalGroup.GroupLabel}
                strokeDasharray="5 5"
                strokeOpacity={isOpaque ? fullOpacity : 0.5}
                strokeWidth={isOpaque ? 2 : 1}
                stroke={'black'}
                dot={false}
                isAnimationActive={false}
                activeDot={false}
                onMouseEnter={() => setChartHoveredKey(gkey)}
                onMouseLeave={() => setChartHoveredKey(null)}
                onClick={(_, e) => {
                  setSelectedKey(gkey === selectedKey ? null : gkey);
                  e.stopPropagation();
                }}
              />
            );
          })()}
        <Tooltip
          content={
            <CustomTooltip
              renderHeader={(label) => (
                <Typography variant="subtitle2">Year: {label}</Typography>
              )}
              numberFormat={numberFormat}
              limitRows={15}
              selectedKey={selectedKey ?? undefined}
              hoveredKey={chartHoveredKey ?? undefined}
            />
          }
          allowEscapeViewBox={{
            x: true,
            y: false,
          }}
        />

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
