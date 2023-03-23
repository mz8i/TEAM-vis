import { Box, Stack, Typography } from '@mui/material';
import { Dot } from 'recharts';

import { isFullOpacity } from '../chart-utils';

export function LegendItem({
  payload: {
    color,
    hovered,
    selected,
    type,
    payload: { strokeDasharray },
    value: name,
  },
}: {
  payload: any;
}) {
  const isOpaque = isFullOpacity(hovered, selected);
  const opacity = isOpaque ? 1 : 0.3;
  const lineHeight = 1.5;
  const fontSize = 14;
  const shapeSize = 10;

  return (
    <Stack direction="row" alignItems="start" justifyContent="start">
      <Box
        mr={1}
        height={lineHeight * fontSize}
        display="flex"
        alignItems="center"
      >
        <svg width={shapeSize} height={shapeSize}>
          <Dot
            r={shapeSize / 2}
            cx={shapeSize / 2}
            cy={shapeSize / 2}
            fill={color}
            opacity={opacity}
          />
        </svg>
      </Box>
      <Box sx={{ lineHeight }}>
        <Typography
          sx={{ opacity }}
          variant="caption"
          lineHeight={1}
          fontSize={fontSize}
          fontWeight={selected ? '800' : '400'}
        >
          {name}
        </Typography>
      </Box>
    </Stack>
  );
}
