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
import { Flipped, Flipper } from 'react-flip-toolkit';
import { Dot, TooltipProps } from 'recharts';

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
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
        <Box m={1}>
          {/* TODO: Remove hardcoded Year: string */}
          <Typography variant="h6">Year: {label}</Typography>
        </Box>

        <Table size="small">
          <TableBody>
            <Flipper flipKey={sorted.map((x) => x.value).join('+')}>
              {sorted.map(({ value, name, dataKey, color }) => {
                if (value == null) return null;

                return (
                  <Flipped flipId={dataKey}>
                    <TableRow>
                      <TableCell align="right">
                        {/* TODO: remove hardcoded number formatting */}
                        {value.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                          useGrouping: true,
                        })}
                      </TableCell>
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
            </Flipper>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return null;
};
