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
import { TooltipProps } from 'recharts';

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload?.length) {
    const sorted = _.sortBy(payload, ({ value }) =>
      value == null ? -Infinity : -value
    );

    return (
      <TableContainer component={Paper} sx={{ overflowX: 'clip' }}>
        <Box m={1}>
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
                        {value.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                          useGrouping: true,
                        })}
                      </TableCell>
                      <TableCell align="left" sx={{ color }}>
                        {name}
                      </TableCell>
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
