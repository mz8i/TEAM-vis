import { CssBaseline } from '@mui/material';
import { FC, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

export const AppRoot: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RecoilRoot>
      <CssBaseline />
      {children}
    </RecoilRoot>
  );
};
