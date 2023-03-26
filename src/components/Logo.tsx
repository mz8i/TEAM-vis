import { Box } from '@mui/material';
import { FC } from 'react';

import { AppLink } from '../utils/nav';

export const Logo: FC<{
  img: string;
  tooltip: string;
  link: string;
  height: number;
}> = ({ img, tooltip, link, height }) => {
  const src = import.meta.env.BASE_URL + img;
  return (
    <Box py={1} px={1.5}>
      <AppLink href={link} title={tooltip}>
        <img height={height} src={src} />
      </AppLink>
    </Box>
  );
};
