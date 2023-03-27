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
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  renderHeader,
  numberFormat,
}: CustomTooltipProps) => {
  if (active && payload?.length) {
    const sorted = _.sortBy(payload, ({ value }) =>
      value == null ? -Infinity : -value
    );

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
              {sorted.map(({ value, name, dataKey, color }) => {
                if (value == null) return null;

                return (
                  <Flipped key={dataKey} flipId={dataKey}>
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
