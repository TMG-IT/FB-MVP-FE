import React, { useState, useEffect } from 'react';
import './ContactForm.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  postSubscription,
  getTermsOfService,
  getPrivacyPolicy
} from '../../api/api';
import { useStateValue } from '../../store/store';

interface IContactForm extends RouteComponentProps {}

const ContactForm: React.FC<IContactForm> = ({ history }) => {
  const [firstNameInputValue, setFirstNameInputValue] = useState<string>('');
  const [lastNameInputValue, setLastNameInputValue] = useState<string>('');
  const [emailInputValue, setEmailInputValue] = useState<string>('');
  const [isPostingSubscription, setIsPostingSubscription] = useState<boolean>(
    false
  );
  const [showFirstnameError, setShowFirstnameError] = useState(false);
  const [showLastnameError, setShowLastnameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPrivacyError, setShowPrivacyError] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const { dispatch, state } = useStateValue();

  const termsCheckboxChecked = state.termsAccepted;
  const privacyCheckboxChecked = state.privacyAccepted;

  useEffect(() => {
    if (state.termsAccepted) {
      setShowTermsError(false);
    }

    if (state.privacyAccepted) {
      setShowPrivacyError(false);
    }
  }, [state.privacyAccepted, state.termsAccepted]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'setTermsAccepted', payload: false });
      dispatch({ type: 'setPrivacyAccepted', payload: false });
    };
    // eslint-disable-next-line
  }, []);

  const handleModal = async (model: string) => {
    dispatch({ type: 'showModal' });
    if (model === 'ToS') {
      dispatch({
        type: 'setModalData',
        payload: {
          title: 'Terms of Service',
          text: ''
        }
      });
      dispatch({
        type: 'setIsModalLoading',
        payload: true
      });
      const tosText = await getTermsOfService();
      dispatch({
        type: 'setModalData',
        payload: {
          title: 'Terms of Service',
          text: tosText.data[0].text
        }
      });
      dispatch({
        type: 'setIsModalLoading',
        payload: false
      });
    } else if (model === 'PP') {
      dispatch({
        type: 'setModalData',
        payload: {
          title: 'Privacy Policy',
          text: ''
        }
      });
      dispatch({
        type: 'setIsModalLoading',
        payload: true
      });
      const ppText = await getPrivacyPolicy();
      dispatch({
        type: 'setModalData',
        payload: {
          title: 'Privacy Policy',
          text: ppText.data[0].text
        }
      });
      dispatch({
        type: 'setIsModalLoading',
        payload: false
      });
    }
  };

  const onFormSubmit = () => {
    if (
      isEmailValid() &&
      termsCheckboxChecked &&
      privacyCheckboxChecked &&
      firstNameInputValue.length > 0 &&
      lastNameInputValue.length > 0
    ) {
      setIsPostingSubscription(true);
      postSubscription({
        first_name: firstNameInputValue,
        last_name: lastNameInputValue,
        email: emailInputValue
      })
        .then(() => {
          setIsPostingSubscription(false);
          history.push('/finished');
        })
        .catch(e => {
          setIsPostingSubscription(false);
        });
    } else {
      if (firstNameInputValue.length <= 0) {
        setShowFirstnameError(true);
      } else {
        setShowFirstnameError(false);
      }
      if (lastNameInputValue.length <= 0) {
        setShowLastnameError(true);
      } else {
        setShowLastnameError(false);
      }
      if (!isEmailValid()) {
        setShowEmailError(true);
      } else {
        setShowEmailError(false);
      }
      if (!termsCheckboxChecked) {
        setShowTermsError(true);
      }
      if (!privacyCheckboxChecked) {
        setShowPrivacyError(true);
      }
    }
  };

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\./;
    return emailRegex.test(emailInputValue);
  };

  const isInternetexplorer = () => {
    const ua = window.navigator.userAgent;
    return ua.indexOf('Trident/7.0') > -1;
  };

  const isEdge = () => {
    const ua = window.navigator.userAgent;
    return ua.indexOf('Edge') > -1;
  };

  return (
    <div className="c-subscribe__form">
      <form className="b-subscribe__form">
        <div className="b-subscribe__fieldGroup">
          <input
            id="first_name"
            name="first_name"
            placeholder="Name"
            type="text"
            value={firstNameInputValue}
            className={
              'b-subscribe__input' +
              (showFirstnameError ? ' b-subscribe__input--error' : '')
            }
            onChange={e => {
              const { value } = e.target;
              if (value.length > 0) {
                setShowFirstnameError(false);
              } else {
                setShowFirstnameError(true);
              }
              setFirstNameInputValue(value);
            }}
          />
          {!isInternetexplorer() && !isEdge() && (
            <label htmlFor="first_name" className="b-subscribe__placeholder">
              First Name
            </label>
          )}
        </div>

        {showFirstnameError && (
          <span className="b-subscribe__error">
            Please enter your first name
          </span>
        )}

        <div className="b-subscribe__fieldGroup">
          <input
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            type="text"
            value={lastNameInputValue}
            className={
              'b-subscribe__input' +
              (showLastnameError ? ' b-subscribe__input--error' : '')
            }
            onChange={e => {
              const { value } = e.target;
              if (value.length > 0) {
                setShowLastnameError(false);
              } else {
                setShowLastnameError(true);
              }
              setLastNameInputValue(value);
            }}
          />
          {!isInternetexplorer() && !isEdge() && (
            <label htmlFor="last_name" className="b-subscribe__placeholder">
              Last Name
            </label>
          )}
        </div>

        {showLastnameError && (
          <span className="b-subscribe__error">
            Please enter your last name
          </span>
        )}

        <div className="b-subscribe__fieldGroup">
          <input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            value={emailInputValue}
            className={
              'b-subscribe__input' +
              (showEmailError ? ' b-subscribe__input--error' : '')
            }
            onChange={e => {
              const { value } = e.target;
              if (value.length === 0 || isEmailValid()) {
                setShowEmailError(false);
              }
              setEmailInputValue(value);
            }}
          />
          {!isInternetexplorer() && !isEdge() && (
            <label htmlFor="email" className="b-subscribe__placeholder">
              Email
            </label>
          )}
        </div>

        {showEmailError && (
          <span className="b-subscribe__error">
            The entered e-mail format is invalid
          </span>
        )}

        <div className="b-subscribe__terms">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            onChange={e => {
              if (e.target.checked) {
                setShowTermsError(false);
              }
              dispatch({ type: 'setTermsAccepted', payload: e.target.checked });
            }}
            checked={termsCheckboxChecked}
            className={showTermsError ? 'b-subscribe__input--error' : ''}
          />
          <label
            htmlFor="terms"
            className={
              'b-subscribe__label' +
              (showTermsError ? ' b-subscribe__label--error' : '')
            }
          >
            I agree with the{' '}
            <span
              onClick={e => {
                e.preventDefault();
                handleModal('ToS');
              }}
              className="b-subscribe__"
            >
              Terms of Service
            </span>
          </label>
          {showTermsError && (
            <span className="b-subscribe__error">
              Agreeing with Terms of Service is required
            </span>
          )}
        </div>

        <div className="b-subscribe__terms">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            onChange={e => {
              if (e.target.checked) {
                setShowPrivacyError(false);
              }
              dispatch({
                type: 'setPrivacyAccepted',
                payload: e.target.checked
              });
            }}
            checked={privacyCheckboxChecked}
            className={showPrivacyError ? 'b-subscribe__input--error' : ''}
          />
          <label
            htmlFor="privacy"
            className={
              'b-subscribe__label' +
              (showPrivacyError ? ' b-subscribe__label--error' : '')
            }
          >
            I agree with the{' '}
            <span
              onClick={e => {
                e.preventDefault();
                handleModal('PP');
              }}
            >
              Privacy Policy
            </span>
          </label>
          {showPrivacyError && (
            <span className="b-subscribe__error">
              Agreeing with Privacy Policy is required
            </span>
          )}
        </div>
        <button
          className="btn btn--primary"
          type="button"
          disabled={isPostingSubscription}
          onClick={onFormSubmit}
        >
          Enter my email
        </button>
      </form>
    </div>
  );
};

export default withRouter(ContactForm);
