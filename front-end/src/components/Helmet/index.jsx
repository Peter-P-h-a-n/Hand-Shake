import { memo } from 'react';
import { Helmet as ReactHelmet } from 'react-helmet-async';

export const Helmet = memo(({ title, children }) => {
  return (
    <ReactHelmet>
      <title>HandShake - {title}</title>
      {children}
    </ReactHelmet>
  );
});

Helmet.displayName = 'Helmet';
