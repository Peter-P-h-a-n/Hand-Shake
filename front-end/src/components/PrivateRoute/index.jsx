import { Route, Redirect } from 'react-router-dom';
import { PIECE_OF_CAKE } from 'utils/constants';

const PrivateRoute = (props) => {
  const localAddress = localStorage.getItem(PIECE_OF_CAKE);

  return localAddress ? <Route {...props} /> : <Redirect to="/404" exact />;
};

export default PrivateRoute;
