import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const AppLink = ({ href, title, children, ...otherProps }: any) => {
  return (
    <MuiLink
      component={RouterLink}
      to={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      title={title}
      {...otherProps}
    >
      {children}
    </MuiLink>
  );
};
