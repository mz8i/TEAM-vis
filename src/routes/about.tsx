import { Container, Toolbar, Typography } from '@mui/material';

import AboutPage from '../text/AboutPage.mdx';
import { AppLink } from '../utils/nav';

export const AboutRoute = () => {
  return (
    <Container maxWidth="md">
      <AboutPage
        components={{
          h1: ({ children }) => (
            <Toolbar disableGutters>
              <Typography variant="h4" component="h1" gutterBottom>
                {children}
              </Typography>
            </Toolbar>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" component="h2" gutterBottom>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" component="h3" gutterBottom>
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography variant="body1" paragraph sx={{ hyphens: 'auto' }}>
              {children}
            </Typography>
          ),
          a: ({ children, href, title }) => (
            <AppLink href={href} title={title}>
              {children}
            </AppLink>
          ),
        }}
      />
    </Container>
  );
};
