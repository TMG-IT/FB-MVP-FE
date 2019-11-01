import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface ISessionExpired extends RouteComponentProps {}

const SessionExpired: React.FC<ISessionExpired> = ({ history }) => {
  return (
    <div className="container-s">
      <div className="b-invalidSession">
        <h1 className="b-invalidSession__title e-title">Sorry!</h1>
        <p className="b-invalidSession__txt">
          The session has expired. Unfortunately, we can only accept feedback
          within 24 hours of the workout.
        </p>
        <button
          onClick={() => history.push('/')}
          className="btn btn--secondary"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default withRouter(SessionExpired);
