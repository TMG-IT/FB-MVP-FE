import React from 'react';
import { useStateValue } from '../../store/store';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './Modal.scss';

const Modal: React.FC = () => {
  const { state, dispatch } = useStateValue();
  const showModal = state && state.isModalShowing;
  const title = state ? state.modalTitle : '';
  const text = state ? state.modalText : '';
  const loading = state ? state.isModalLoading : true;

  const handleAcceptClick = () => {
    if (title.toLowerCase() === 'privacy policy') {
      dispatch({
        type: 'setPrivacyAccepted',
        payload: true
      });
    } else {
      dispatch({
        type: 'setTermsAccepted',
        payload: true
      });
    }

    dispatch({
      type: 'hideModal'
    });
  };

  const handleDeclineClick = () => {
    if (title.toLowerCase() === 'privacy policy') {
      dispatch({
        type: 'setPrivacyAccepted',
        payload: false
      });
    } else {
      dispatch({
        type: 'setTermsAccepted',
        payload: false
      });
    }

    dispatch({
      type: 'hideModal'
    });
  };

  if (showModal) {
    return (
      <div className="overlay">
        <div className="b-popup">
          <button
            onClick={() => dispatch({ type: 'hideModal' })}
            className="b-popup__close"
          />
          <h1 className="b-popup__title e-title">{title}</h1>

          {loading ? (
            <LoadingIndicator />
          ) : (
            <div className="b-popup__content">
              <p
                className="b-popup__txt"
                dangerouslySetInnerHTML={{ __html: text }}
              />
              <button
                onClick={handleDeclineClick}
                className="btn btn--secondary"
              >
                Decline
              </button>
              <button onClick={handleAcceptClick} className="btn btn--primary">
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default Modal;
