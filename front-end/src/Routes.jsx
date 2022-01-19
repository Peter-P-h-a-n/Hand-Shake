import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Layout } from 'components/Layout';

import NotFoundPage from 'containers/NotFoundPage';
import Recruitment from 'containers/Recruitment';
import ContractDetails from 'containers/ContractDetails';
import CreateContract from 'containers/CreateContract';
import MyContract from 'containers/MyContract';
import UserProfile from 'containers/UserProfile';

import { ModalWrapper } from 'components/NotificationModal';
import { HandShakeLoader } from 'components/Loader';

import PrivateRoute from 'components/PrivateRoute';
import ErrorBoundary from './ErrorBoundary';

import { history } from 'store';

function Routes() {
  return (
    <ConnectedRouter history={history}>
      <ErrorBoundary>
        <Layout>
          <Switch>
            <Redirect from="/" to="/recruitment" exact />
            <Route path="/recruitment" exact component={Recruitment} />
            <Route path="/user/:address" exact component={UserProfile} />
            <PrivateRoute path="/my-contract" exact component={MyContract} />
            <PrivateRoute path="/create-recruitment" exact component={CreateContract} />
            <PrivateRoute path="/edit-recruitment" exact render={() => <CreateContract isEdit />} />

            <Route path="/details/:id" exact component={ContractDetails} />
            <Route path="/invite/:key" exact render={() => <ContractDetails isInvitation />} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
          <ModalWrapper />
          <HandShakeLoader />
        </Layout>
      </ErrorBoundary>
    </ConnectedRouter>
  );
}

export default Routes;
