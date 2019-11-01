import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './Welcome.scss';
import { useStateValue } from '../../store/store';

interface IWelcome extends RouteComponentProps {}

const Welcome: React.FC<IWelcome> = ({ history }) => {
  const {
    state: {
      sessionData: { sessionName, coachName }
    }
  } = useStateValue();

  const goToFeedbackScreen = () => {
    history.push('/feedback');
  };

  return (
    <div className="container-s">
      <div className="b-welcome">
        <h1 className="b-welcome__title e-title">Hello!</h1>
        <p className="b-welcome__txt">
          We'd love to know what you thought about the{' '}
          <span>{sessionName}</span> workout delivered by{' '}
          <span> {coachName}</span>. It won't take more than 2 minutes!
        </p>
        <button onClick={goToFeedbackScreen} className="btn btn--primary">
          {' '}
          Give feedback
        </button>
      </div>
    </div>
  );
};

export default withRouter(Welcome);
