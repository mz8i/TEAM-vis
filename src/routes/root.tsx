import { Box, Divider, Link, Stack, Toolbar, Typography } from '@mui/material';
import { CheckerReturnType, object } from '@recoiljs/refine';
import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { AppRoot } from '../AppRoot';
import { loadJson } from '../data/fetch/load-file';
import { ConfigType } from '../data/fetch/models/config';
import { configState } from '../root-state';
import { ScenarioPanel } from '../sections/scenario/ScenarioPanel';
import { allScenariosState } from '../sections/scenario/scenario-state';
import AboutSidebar from '../text/AboutSidebar.mdx';
import { StateSetter } from '../utils/recoil/StateSetter';
import { TypedLoaderFunction, useCheckedLoaderData } from '../utils/router';

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  return {
    config: await loadJson('/config/config.json', { request }),
  };
};

type RootLoaderData = {
  config: ConfigType;
};

export const RootRoute = () => {
  const { config } = useLoaderData() as RootLoaderData;

  return (
    <AppRoot>
      <StateSetter value={config} state={configState} />
      <Box display="flex" flexDirection="row" justifyContent="stretch">
        <Box height="100vh" width="400px" bgcolor="whitesmoke">
          <Stack direction="column" height="100%" divider={<Divider />}>
            <Toolbar>
              <Typography variant="h3" fontWeight={600}>
                <Link
                  sx={{ textDecoration: 'none' }}
                  component={RouterLink}
                  to="/"
                >
                  TEAM
                </Link>
              </Typography>
            </Toolbar>
            <Box height={300}>
              <SidebarSection>
                <ScenarioPanel />
              </SidebarSection>
            </Box>
            <Box flexGrow={1}>
              <SidebarSection>
                <Typography variant="h5">About</Typography>
                <AboutSidebar
                  components={{
                    a: ({ href, title, children }) =>
                      href ? (
                        <Link
                          textAlign="right"
                          width="100%"
                          display="block"
                          component={RouterLink}
                          to={href}
                          children={children}
                        />
                      ) : null,
                  }}
                />
              </SidebarSection>
            </Box>
            <Box height={200}>
              <Typography>Logos</Typography>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ width: 'calc(100vw-400px)', height: '100vh' }}>
          <Outlet />
        </Box>
      </Box>
    </AppRoot>
  );
};

function SidebarSection({ children }: any) {
  return <Box p={2}>{children}</Box>;
}
