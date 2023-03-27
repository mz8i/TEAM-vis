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
import _ from 'lodash';
import { ReactElement } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { Dot, TooltipProps } from 'recharts';

export type CustomTooltipProps = TooltipProps<number, string> & {
  renderHeader: (label: string) => ReactElement;
  numberFormat: (x: number) => string;
  limitRows?: number;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  renderHeader,
  numberFormat,
  limitRows,
}: CustomTooltipProps) => {
  if (active && payload?.length) {
    const sorted = _.sortBy(payload, ({ value }) =>
      value == null ? -Infinity : -value
    );

    const n = sorted.length;
    const items = makeSummary(sorted, limitRows);
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
                      <TableCell align="left">{name}</TableCell>
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
function makeSummary<T>(items: T[], limit: number | undefined): Row<T>[] {
  if (limit == null || items.length <= limit) return items as Row<T>[];

  const n = items.length;
  const bottom = 3;
  const top = limit - bottom - 1;
  const rest = n - bottom - top;

  return [
    ...items.slice(0, top),
    { nMore: rest },
    ...items.slice(-bottom),
  ] as Row<T>[];
}
