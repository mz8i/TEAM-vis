import { Box, Stack, Typography } from '@mui/material';
import { Rectangle } from 'recharts';

import { isFullOpacity } from '../chart-utils';

export function LegendItem({
  payload: {
    color,
    hovered,
    selected,
    payload: { name },
  },
}: {
  payload: any;
}) {
  const isOpaque = isFullOpacity(hovered, selected);
  const opacity = isOpaque ? 1 : 0.3;
  const lineHeight = 1.5;
  const fontSize = 12;
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
          <Rectangle
            width={shapeSize}
            height={shapeSize}
            fill={color}
            opacity={opacity}
          ></Rectangle>
        </svg>
      </Box>
      <Box sx={{ lineHeight }}>
        <Typography
          sx={{ opacity }}
          variant="caption"
          color={color}
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
