import { Box, Divider, Link, Stack, Toolbar, Typography } from '@mui/material';
import { object } from '@recoiljs/refine';
import { LoaderFunctionArgs, Outlet } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { AppRoot } from '../AppRoot';
import { loadJson } from '../data/fetch/load-file';
import { configChecker } from '../data/fetch/models/config';
import { allDimensionsMetaChecker } from '../data/fetch/models/dimensions-meta';
import { configState } from '../root-state';
import { allDimensionsMetaState } from '../sections/data-tab/dimensions/dimensions-state';
import { ScenarioPanel } from '../sections/scenario/ScenarioPanel';
import AboutSidebar from '../text/AboutSidebar.mdx';
import { AppLink } from '../utils/nav';
import { StateSetter } from '../utils/recoil/StateSetter';
import { MutableCheckerReturn } from '../utils/recoil/refine';
import { useCheckedLoaderData } from '../utils/router';

const rootLoaderChecker = object({
  config: configChecker,
  allDimensionsMeta: allDimensionsMetaChecker,
});

type RootLoaderData = MutableCheckerReturn<typeof rootLoaderChecker>;

export const rootLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<RootLoaderData> => {
  return {
    config: await loadJson('/config/config.json', { request }),
    allDimensionsMeta: await loadJson('/config/dimensions-meta.json', {
      request,
    }),
  };
};

export const RootRoute = () => {
  const { config, allDimensionsMeta } = useCheckedLoaderData(rootLoaderChecker);

  return (
    <AppRoot>
      <StateSetter value={config} state={configState} />
      <StateSetter value={allDimensionsMeta} state={allDimensionsMetaState} />
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
                        <AppLink
                          textAlign="right"
                          width="100%"
                          display="block"
                          href={href}
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
