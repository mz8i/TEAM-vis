import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';

import { queryClient } from './query-client';
import { useCheckScenarioSlug } from './sections/scenario/scenario-state';
import { theme } from './theme';
import { RecoilURLSyncSimple } from './utils/recoil/RecoilURLSyncSimple';

export const AppRoot: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <RecoilURLSyncJSON
            storeKey="json-url"
            location={{ part: 'queryParams' }}
          >
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
      </QueryClientProvider>
    </ThemeProvider>
  );
};

function ValidateRecoilState() {
  useCheckScenarioSlug();

  return null;
}
