import React, { useState } from 'react';
import { validateSessionCode } from '../../api/api';
import { RouteComponentProps, withRouter } from 'react-router';
import { useStateValue } from '../../store/store';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

interface ISessionCodeEntry extends RouteComponentProps {}

export interface ISessionData {
  coachName: string;
  sessionName: string;
  sessionCode: string;
  questionList: Array<any>;
  collectContactData: boolean;
  uuid: string;
}

const SessionCodeEntry: React.FC<ISessionCodeEntry> = ({ history }) => {
  const [sessionCodeInputValue, setSessionCodeInputValue] = useState<string>(
    ''
  );
  const [isCheckingCode, setIsChekingCode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { dispatch } = useStateValue();

  const checkCodeValidity = async () => {
    try {
      setIsChekingCode(true);
      setErrorMessage('');
      const response = await validateSessionCode(sessionCodeInputValue);
      setIsChekingCode(false);
      if (response.status < 200 || response.status >= 300) {
        if (response.status === 403) {
          dispatch({
            type: 'setSessionData',
            payload: {
              sessionName: response.data.session_name
            }
          });
          history.push('/session-expired');
        } else {
          setErrorMessage(response.data.message);
        }
      } else {
        const { data: sessionData } = response;
        const {
          questions,
          coach,
          session_name,
          session_code,
          collect_contact_data,
          uuid
        } = sessionData;
        const action = {
          type: 'setSessionData',
          payload: {
            coachName: coach.first_name + ' ' + coach.last_name,
            sessionName: session_name,
            sessionCode: session_code,
            questionList: questions,
            collectContactData: collect_contact_data,
            uuid
          } as ISessionData
        };
        dispatch(action);
        dispatch({ type: 'confirmSession' });
        history.push('/welcome');
      }
    } catch (error) {
      console.log('Error validating session code: ', error);
    }
  };

  return (
    <div className="container-s">
      <div className="b-sessionCode">
        <h1 className="b-sessionCode__title e-title">Please enter the code</h1>
        <input
          placeholder="Enter 6-digit code"
          value={sessionCodeInputValue}
          onChange={e => {
            const { value, maxLength } = e.target;
            if (value.length === 0) {
              setErrorMessage('');
            }
            const numberValue = value
              .replace(/[^\d]+/g, '')
              .slice(0, maxLength);
            setSessionCodeInputValue(numberValue);
          }}
          type="text"
          className={
            'b-sessionCode__input' +
            (errorMessage.length > 0 ? ' b-sessionCode__input--error' : '')
          }
          onKeyPress={e => {
            if (
              e.key === 'Enter' &&
              sessionCodeInputValue &&
              sessionCodeInputValue.length === 6 &&
              !isCheckingCode
            ) {
              checkCodeValidity();
            }
          }}
          maxLength={6}
          minLength={6}
        />
        <p className="b-sessionCode__error">{errorMessage}</p>
        {isCheckingCode && <LoadingIndicator />}
        <button
          disabled={
            !sessionCodeInputValue ||
            sessionCodeInputValue.length !== 6 ||
            isCheckingCode
          }
          onClick={checkCodeValidity}
          className="btn btn--primary"
        >
          Enter Code
        </button>
        <p className="b-sessionCode__txt">The code is provided by your coach</p>
      </div>
    </div>
  );
};

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
const vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

export default withRouter(SessionCodeEntry);
