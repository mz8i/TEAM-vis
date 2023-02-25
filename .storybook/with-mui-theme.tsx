import { CssBaseline } from '@mui/material';

export const withMuiTheme = (Story) => {
  return (
    <>
      <CssBaseline />
      <Story />
    </>
  );
};
