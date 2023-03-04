import { useMemo } from 'react';
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
      obj[key] = gLookups[key][yr];
    }

    data.push(obj);
  }

  return data;
}

export const RechartsChart = ({ groups }: { groups: DataGroup[] }) => {
  const data = useMemo(() => processData(groups), [groups]);

  return (
    <ResponsiveContainer>
      <AreaChart data={data} stackOffset="expand">
        <XAxis dataKey="Year" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {groups.map((group) => (
          <Area
            key={group.GroupKey}
            dataKey={group.GroupKey}
            stackId="areas"
            name={group.GroupLabel}
          />
        ))}
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
};
