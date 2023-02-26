import { CssBaseline } from '@mui/material';
import { FC, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import { RecoilURLSyncSimple } from './utils/recoil/RecoilURLSyncSimple';

export const AppRoot: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RecoilRoot>
      <RecoilURLSyncSimple location={{ part: 'queryParams' }}>
        <CssBaseline />
        {children}
      </RecoilURLSyncSimple>
    </RecoilRoot>
  );
};
