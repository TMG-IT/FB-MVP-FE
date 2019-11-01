import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useStateValue } from '../../store/store';

interface IFinishPage extends RouteComponentProps {}

const FinishPage: React.FC<IFinishPage> = ({ history }) => {
  const { dispatch } = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'setHeaderDark'
    });
    return () => {
      dispatch({
        type: 'setHeaderLight'
      });
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="c-finish">
      <div className="container-s">
        <div className="b-finish">
          <img
            src={require('../../assets/images/success.svg')}
            className="b-finish__img"
            alt=""
          />
          <h1 className="b-finish__title e-title">That's it!</h1>
          <p className="b-finish__txt">
            Have a lovely week - hope you spend some of it practicing what
            you’ve learned with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(FinishPage);
