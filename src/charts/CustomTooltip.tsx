import { ArrowRight } from '@mui/icons-material';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import _, { range } from 'lodash';
import { ReactElement } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { Dot, TooltipProps } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

export type CustomTooltipProps = TooltipProps<number, string> & {
  renderHeader: (label: string) => ReactElement;
  numberFormat: (x: number) => string;
  limitRows?: number;
  selectedKey?: string;
  hoveredKey?: string;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  renderHeader,
  numberFormat,
  limitRows,
  selectedKey,
  hoveredKey,
}: CustomTooltipProps) => {
  if (active && payload?.length) {
    const sorted = _.sortBy(payload, ({ value }) =>
      value == null ? -Infinity : -value
    );

    const keepKeys = [hoveredKey, selectedKey].filter(Boolean) as string[];
    const keyFn = (x: Payload<number, string>) => x.dataKey as string;
    const n = sorted.length;
    const items = makeSummary(sorted, limitRows, keepKeys, keyFn);
    const shouldFlip = limitRows == null || n <= limitRows;

    const shapeSize = 12;
    return (
      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'clip',
          backgroundColor: 'rgba(255,255,255,0.85)',
        }}
      >
        <Box m={1}>{renderHeader(label)}</Box>

        <Flipper flipKey={sorted.map((x) => x.value).join('+')}>
          <Table size="small">
            <TableBody>
              {items.map(({ nMore, value, name, dataKey, color }) => {
                if (nMore != null) {
                  return (
                    <TableRow>
                      <TableCell padding="none"></TableCell>
                      <TableCell></TableCell>
                      <TableCell padding="none"></TableCell>
                      <TableCell align="left">
                        <Typography color="GrayText">
                          {nMore} more...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (value == null) return null;

                return (
                  <Flipped
                    key={dataKey}
                    flipId={dataKey}
                    translate={shouldFlip}
                    scale={shouldFlip}
                  >
                    <TableRow>
                      <TableCell padding="none" width="20px">
                        {dataKey === hoveredKey && (
                          <ArrowRight
                            fontSize="small"
                            sx={{ color: 'GrayText' }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">{numberFormat(value)}</TableCell>
                      <TableCell padding="none">
                        <svg height={shapeSize} width={shapeSize}>
                          <Dot
                            cx={shapeSize / 2}
                            cy={shapeSize / 2}
                            r={shapeSize / 2}
                            fill={color}
                          />
                        </svg>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: dataKey === selectedKey ? 800 : 400 }}
                      >
                        {name}
                      </TableCell>
                    </TableRow>
                  </Flipped>
                );
              })}
            </TableBody>
          </Table>
        </Flipper>
      </TableContainer>
    );
  }

  return null;
};

type Row<T> = T & { nMore?: number };
function makeSummary<T>(
  items: T[],
  limit: number | undefined,
  keepKeys?: string[],
  keyFn?: (x: T) => string
): Row<T>[] {
  if (keepKeys != null && keepKeys.length > 2)
    throw new Error(
      'Tooltip summary currently only supports up to 2 special rows'
    );

  if (limit == null || items.length <= limit) return items as Row<T>[];

  let specialIndicesToKeep: number[] = [];

  if (keyFn != null && keepKeys != null && keepKeys.length > 0) {
    specialIndicesToKeep = items
      .map((x, i) => [keyFn(x), i] as const)
      .filter(([key]) => keepKeys.includes(key))
      .map(([, i]) => i);
  }

  const n = items.length;

  const idealBottom = 3;
  const idealTop = limit - idealBottom - 1;

  // if some special indices fall into the top/bottom standard ranges, we can ignore them for now
  const specialIndicesNotInTopBottom = specialIndicesToKeep.filter(
    (i) => i >= idealTop && i < n - idealBottom
  );
  const specialMiddleSize = specialIndicesNotInTopBottom.length * 2 + 1;

  const bottom = 3;
  const top = limit - bottom - specialMiddleSize;
  const rest = n - bottom - top;

  // create a sorted array of indices that should be visible
  const indicesToKeep = [
    ...range(0, top),
    ...specialIndicesNotInTopBottom,
    ...range(n - bottom - 1, n - 1),
  ];

  const finalRows: Row<T>[] = [];

  let previousIndex = null;
  for (const index of indicesToKeep) {
    if (previousIndex != null) {
      const gapSize = index - previousIndex - 1;

      // if there was a gap of just one, simply add that item because it's not worth adding an "N more..." row here
      if (gapSize == 1) {
        finalRows.push(items[index - 1] as Row<T>);
      } else if (gapSize > 1) {
        finalRows.push({ nMore: gapSize } as Row<T>);
      }
    }

    // add current item
    finalRows.push(items[index] as Row<T>);

    previousIndex = index;
  }

  return finalRows;
}
