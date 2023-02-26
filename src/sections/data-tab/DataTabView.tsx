import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { tabBySlugState } from './data-tab-state';

export const DataTabView: FC<{ slug: string }> = ({ slug }) => {
  const dataTab = useRecoilValue(tabBySlugState(slug));

  return (
    <Box>
      <Typography variant="caption">{JSON.stringify(dataTab)}</Typography>
    </Box>
  );
};
