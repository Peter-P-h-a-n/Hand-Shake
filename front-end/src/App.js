import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';

import Routes from './Routes';
import { addHanaListener } from './connectors/Hana';

addHanaListener();

function App() {
  console.log('--version: 1.0.1');

  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
