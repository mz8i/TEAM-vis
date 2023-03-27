import { Typography } from '@mui/material';
import { ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ScenarioValue } from '../../../data/scenario';
import { CustomTooltip } from '../../CustomTooltip';
import { isFullOpacity, isHovered, isSelected } from '../../chart-utils';
import { CustomLegend } from '../../legend/CustomLegend';
import { DataSeries } from '../../types';

export interface YearScenarioValue {
  Year: number;
  Scenario: string;
  Value: number;
}

export type ScenarioDataSeries = DataSeries<YearScenarioValue>;

function yearScen(yr: number, scen: string) {
  return `${yr}-${scen}`;
}

function processData(
  groups: ScenarioDataSeries[],
  scenarios: ScenarioValue[],
  minYear: number,
  snapshotYears: number[]
) {
  const firstScenario = scenarios[0];

  const scenarioYears: [number, string][] = [[minYear, firstScenario.NA]];
  for (const scen of scenarios) {
    // push a separator
    // scenarioYears.push([0, '']);

    for (const yr of snapshotYears) {
      scenarioYears.push([yr, scen.NA]);
    }
  }

  const gKeys: string[] = [];
  const gLookups: Record<string, Map<string, number>> = {};

  for (const g of groups) {
    const lookup: Map<string, number> = (gLookups[g.GroupKey] = new Map());
    gKeys.push(g.GroupKey);

    for (const row of g.Rows) {
      const yr = row.Year;
      const scenario = row.Scenario;

      lookup.set(yearScen(yr, scenario), row.Value);
    }
  }

  const data: any[] = [];

  for (const [yr, scen] of scenarioYears) {
    const scenLabel = yr === minYear ? 'Baseline' : scen;
    const obj: any = {
      Year: yr,
      Scenario: scenLabel,
      ScenarioYear: `${scenLabel}@@${yr}`,
    };

    for (const key of gKeys) {
      obj[key] = gLookups[key].get(yearScen(yr, scen)) ?? 0;
    }

    data.push(obj);
  }

  return data;
}

export interface ScenarioComparisonChartProps {
  groups: ScenarioDataSeries[];
  groupStyleMapping: (g: ScenarioDataSeries) => any;
  scenarios: ScenarioValue[];
  years: number[];
  numberFormat: (x: number) => string;
  yAxisTitle?: ReactNode;
  yAxisNumberFormat?: (x: number) => string;
}

export const ScenarioComparisonChart = ({
  groups,
  groupStyleMapping,
  scenarios,
  years,
  numberFormat,
  yAxisTitle,
  yAxisNumberFormat,
}: ScenarioComparisonChartProps) => {
  const [minYear, ...snapshotYears] = years;
  const middleSnapshotYear =
    snapshotYears[Math.floor(snapshotYears.length / 2)];
  const firstSnapshotYear = snapshotYears[0];

  const legendKeys = useMemo(() => groups.map((x) => x.GroupKey), [groups]);
  const data = useMemo(
    () => processData(groups, scenarios, minYear, snapshotYears),
    [groups]
  );

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [chartHoveredKey, setChartHoveredKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (selectedKey && !legendKeys.includes(selectedKey)) {
      setSelectedKey(null);
    }
  }, [selectedKey, legendKeys, setSelectedKey]);

  function renderScenarioTick(tickProps: any) {
    const { x, y, payload, fill } = tickProps;
    const { value, offset } = payload;

    let [scenario, year] = value.split('@@');
    year = parseInt(year, 10);

    if (year === minYear || year === middleSnapshotYear) {
      return (
        <text x={x} y={y + 7} textAnchor="middle" fill={fill}>
          {scenario}
        </text>
      );
    } else if (year === firstSnapshotYear) {
      return <path d={`M${x - offset},${y + 15}v-25`} stroke={fill} />;
    } else return <></>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} onClick={() => setSelectedKey(null)}>
        <XAxis
          type="category"
          dataKey="ScenarioYear"
          interval={0}
          allowDuplicatedCategory={true}
          tickLine={false}
          tickFormatter={(value) => value.split('@@')[1]}
        />
        <XAxis
          type="category"
          dataKey="ScenarioYear"
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={renderScenarioTick}
          allowDuplicatedCategory={true}
          xAxisId="scenario"
        />
        <YAxis
          width={120}
          axisLine={false}
          tickFormatter={yAxisNumberFormat ?? numberFormat}
        >
          <Label position="insideLeft" angle={-90}>
            {yAxisTitle}
          </Label>
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              renderHeader={(label) => {
                const [scenario, year] = label.split('@@');
                return (
                  <>
                    <Typography variant="subtitle2">Year: {year}</Typography>
                    <Typography variant="subtitle2">{scenario}</Typography>
                  </>
                );
              }}
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
          cursor={false}
        />

        {groups.map((group) => {
          const gkey = group.GroupKey;
          const hovered = isHovered(gkey, hoveredKey);
          const selected = isSelected(gkey, selectedKey);

          const isOpaque = isFullOpacity(hovered, selected);

          const fullOpacity = 1;
          const inactiveOpacity = 0.3;

          const style = groupStyleMapping(group);

          return (
            <Bar
              key={group.GroupKey}
              dataKey={group.GroupKey}
              stackId="groups"
              name={group.GroupLabel}
              barSize={70}
              fillOpacity={isOpaque ? fullOpacity : inactiveOpacity}
              strokeOpacity={isOpaque ? fullOpacity : 0.5}
              strokeWidth={isOpaque ? 2 : 0}
              isAnimationActive={false}
              legendType="rect"
              onMouseEnter={(e) => setChartHoveredKey(group.GroupKey)}
              onMouseLeave={(e) => setChartHoveredKey(null)}
              onClick={(x, y, e) => {
                setSelectedKey(gkey === selectedKey ? null : gkey);
                e.stopPropagation();
              }}
              fill={isOpaque ? style.fill ?? '#3182bd' : '#aaaaaa'}
              stroke={isOpaque ? style.stroke ?? '#3182bd' : '#aaaaaa'}
            />
          );
        })}

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
      </BarChart>
    </ResponsiveContainer>
  );
};
