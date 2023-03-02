import { CssBaseline } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';

import { useCheckScenarioSlug } from './sections/scenario/scenario-state';
import { RecoilURLSyncSimple } from './utils/recoil/RecoilURLSyncSimple';

export const AppRoot: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSON storeKey="json-url" location={{ part: 'queryParams' }}>
        <RecoilURLSyncSimple
          storeKey="simple-url"
          location={{ part: 'queryParams' }}
        >
          <Suspense fallback={null}>
            <ValidateRecoilState />
          </Suspense>
          <CssBaseline />
          {children}
        </RecoilURLSyncSimple>
      </RecoilURLSyncJSON>
    </RecoilRoot>
  );
};

function ValidateRecoilState() {
  useCheckScenarioSlug();

  return null;
}
