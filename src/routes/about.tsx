import { Container, Toolbar, Typography } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { LoaderFunctionArgs, useLoaderData } from 'react-router';

import { queryText } from '../data/fetch/load-file';
import { AppLink } from '../utils/nav';

export function aboutRouteLoader({ request }: LoaderFunctionArgs) {
  return queryText('/text/AboutPage.md', request.signal);
}

export const AboutRoute = () => {
  const markdown = useLoaderData() as string;

  return (
    <Container maxWidth="md">
      <ReactMarkdown
        children={markdown}
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
