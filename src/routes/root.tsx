import { Box, CssBaseline, Stack, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

export const Root = () => {
  return (
    <>
      <CssBaseline />
      <Box display="flex">
        <Box height="100vh" width="400px" bgcolor="whitesmoke">
          <Stack direction="column" height="100%">
            <Toolbar>
              <Link to="/">
                <Typography variant="h3">TEAM</Typography>
              </Link>
            </Toolbar>
            <Box height={200} border="1px dashed gray">
              <Typography variant="h4">Scenario Selection</Typography>
            </Box>
            <Box flexGrow={1} border="1px dashed gray">
              <Typography variant="h4">About</Typography>
              <Typography variant="body1">
                Some text here. <br />
                <Link to="/about">More about</Link>
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
    </>
  );
};
