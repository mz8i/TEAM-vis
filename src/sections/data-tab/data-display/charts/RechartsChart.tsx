import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { isFullOpacity, isHovered, isSelected } from './chart-utils';
import { CustomLegend } from './legend/CustomLegend';

interface YearValue {
  Year: number;
  Value: number;
}
interface DataGroup {
  GroupKey: string;
  GroupLabel: string;
  Grouping: any;
  Rows: YearValue[];
}

function processData(groups: DataGroup[]) {
  let minYear = +Infinity;
  let maxYear = -Infinity;

  const gKeys: string[] = [];
  const gLookups: Record<string, Record<number, number>> = {};

  for (const g of groups) {
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

export const RechartsChart = ({ groups }: { groups: DataGroup[] }) => {
  const keys = useMemo(() => groups.map((x) => x.GroupKey), [groups]);
  const data = useMemo(() => processData(groups), [groups]);

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (selectedKey && !keys.includes(selectedKey)) {
      setSelectedKey(null);
    }
  }, [selectedKey, keys, setSelectedKey]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis dataKey="Year" />
        <YAxis width={120} />
        <CartesianGrid strokeDasharray="2 2" />
        <Tooltip />
        {groups.map((group) => {
          const gkey = group.GroupKey;
          const hovered = isHovered(gkey, hoveredKey);
          const selected = isSelected(gkey, selectedKey);

          const isOpaque = isFullOpacity(hovered, selected);

          const fullOpacity = 0.7;
          const inactiveOpacity = 0.3;

          return (
            <Area
              key={group.GroupKey}
              dataKey={group.GroupKey}
              stackId="areas"
              name={group.GroupLabel}
              fillOpacity={isOpaque ? fullOpacity : inactiveOpacity}
              strokeOpacity={isOpaque ? fullOpacity : 0.5}
              strokeWidth={isOpaque ? 2 : 0}
            />
          );
        })}
        <Legend
          wrapperStyle={{
            width: '200px',
            padding: '1em',
            maxHeight: '90%', // magic number - 10% matches 30px x axis height
            overflowY: 'auto',
          }}
          align="right"
          verticalAlign="top"
          layout="vertical"
          iconType="rect"
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
      </AreaChart>
    </ResponsiveContainer>
  );
};
