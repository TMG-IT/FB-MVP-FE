import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import FeedbackChat from './pages/FeedbackChat/FeedbackChat';
import FeedbackCompleted from './pages/FeedbackCompleted/FeedbackCompleted';
import FinishPage from './pages/FinishPage/FinishPage';
import SessionCodeEntry from './pages/SessionCodeEntry/SessionCodeEntry';
import SessionExpired from './pages/SessionExpired/SessionExpired';
import Welcome from './pages/Welcome/Welcome';
import {
  StateProvider,
  useStateValue,
  initialState,
  reducer
} from './store/store';
import Modal from './components/Modal/Modal';

interface ISessionRoute {
  path: string;
  component: any;
}

const SessionRoute: React.FC<ISessionRoute> = ({ path, component: C }) => {
  const { state } = useStateValue();
  const isSessionConfirmed = state && state.isSessionConfirmed;
  if (isSessionConfirmed) {
    return (
      <Route path={path}>
        <C />
      </Route>
    );
  }
  return <Redirect to="/" />;
};

const Header: React.FC = () => {
  const { state } = useStateValue();
  const darkHeader = state && state.isHeaderDark;
  return (
    <header className={'header' + (darkHeader ? ' header--dark' : '')}>
      <img
        src={require('./assets/images/logo.svg')}
        className="header__logo"
        alt=""
      />
    </header>
  );
};

const App: React.FC = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Modal />
      <Header />
      <Router>
        <Switch>
          <Route path="/session-expired">
            <SessionExpired />
          </Route>
          <SessionRoute path="/welcome" component={Welcome} />
          <SessionRoute path="/feedback" component={FeedbackChat} />
          <SessionRoute path="/complete" component={FeedbackCompleted} />
          <SessionRoute path="/finished" component={FinishPage} />
          <Route path="/">
            <SessionCodeEntry />
          </Route>
        </Switch>
      </Router>
    </StateProvider>
  );
};

export default App;
