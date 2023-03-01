import { CssBaseline } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { useCheckScenarioSlug } from './sections/scenario/scenario-state';
import { RecoilURLSyncSimple } from './utils/recoil/RecoilURLSyncSimple';

export const AppRoot: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RecoilRoot>
      <RecoilURLSyncSimple location={{ part: 'queryParams' }}>
        <Suspense fallback={null}>
          <ValidateRecoilState />
        </Suspense>
        <CssBaseline />
        {children}
      </RecoilURLSyncSimple>
    </RecoilRoot>
  );
};

function ValidateRecoilState() {
  useCheckScenarioSlug();

  return null;
}
