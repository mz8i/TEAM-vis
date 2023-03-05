import { Box, Link, Stack, Toolbar, Typography } from '@mui/material';
import { CheckerReturnType, object } from '@recoiljs/refine';
import { Outlet } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { AppRoot } from '../AppRoot';
import { loadJson } from '../data/load';
import { allScenariosChecker } from '../data/models/scenario';
import { ScenarioPanel } from '../sections/scenario/ScenarioPanel';
import { allScenariosState } from '../sections/scenario/scenario-state';
import { StateSetter } from '../utils/recoil/StateSetter';
import { TypedLoaderFunction, useCheckedLoaderData } from '../utils/router';

const rootDataChecker = object({
  scenarios: allScenariosChecker,
});

type RootData = CheckerReturnType<typeof rootDataChecker>;

export const rootLoader: TypedLoaderFunction<RootData> = async ({
  request,
}) => {
  return {
    scenarios: await loadJson('/data/scenarios.json', { request }),
  };
};

export const RootRoute = () => {
  const { scenarios } = useCheckedLoaderData<RootData>(rootDataChecker);

  return (
    <AppRoot>
      <StateSetter value={scenarios} state={allScenariosState} />
      <Box display="flex">
        <Box height="100vh" width="400px" bgcolor="whitesmoke">
          <Stack direction="column" height="100%">
            <Toolbar>
              <Link
                variant="h3"
                sx={{ textDecoration: 'none' }}
                component={RouterLink}
                to="/"
              >
                TEAM
              </Link>
            </Toolbar>
            <Box height={200} border="1px dashed gray">
              <ScenarioPanel />
            </Box>
            <Box flexGrow={1} border="1px dashed gray">
              <Typography variant="h4">About</Typography>
              <Typography variant="body1">
                Some text here. <br />
                <Link variant="body1" component={RouterLink} to="/about">
                  More
                </Link>
              </Typography>
            </Box>
            <Box height={100} border="1px dashed gray">
              <Typography>Logos</Typography>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
    </AppRoot>
  );
};
