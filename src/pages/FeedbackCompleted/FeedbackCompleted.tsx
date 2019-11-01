import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ContactForm from '../../components/ContactForm/ContactForm';
import { useStateValue } from '../../store/store';
import { getPrivacyPolicy } from '../../api/api';

interface IFeedbackCompleted extends RouteComponentProps {}

const FeedbackCompleted: React.FC<IFeedbackCompleted> = ({ history }) => {
  const { state, dispatch } = useStateValue();
  const { collectContactData } = state.sessionData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrivacyModal = async () => {
    dispatch({ type: 'showModal' });
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
  };

  return (
    <div className="c-confirmation">
      <div className="container-s">
        <div className="b-confirmation">
          {collectContactData && (
            <>
              <h1 className="b-confirmation__title e-title">All Done!</h1>
              <p className="b-confirmation__txt">
                Thank you! We really appreciate your feedback.
              </p>
            </>
          )}
          {!collectContactData && (
            <>
              <h1 className="b-confirmation__title e-title">That's it!</h1>
              <p className="b-confirmation__txt">
                Thanks, and we’ll be in touch soon.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="c-subscribe">
        <div className="b-subscribe">
          {collectContactData && (
            <div>
              <h1 className="b-subscribe__title">Stay in touch</h1>
              <p className="b-subscribe__text">
                We’d love to stay in touch. If you’d like more tips and insights
                on the topic of today’s workout, please leave your email below.
              </p>
              <p className="b-subscribe__text">
                We value your{' '}
                <span
                  onClick={handlePrivacyModal}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  privacy
                </span>{' '}
                and never spam!
              </p>
              <ContactForm />
            </div>
          )}
        </div>
        <button
          className="btn btn--secondary"
          onClick={() => {
            history.push('/finished');
          }}
        >
          I'm done, thanks
        </button>
      </div>
    </div>
  );
};

export default withRouter(FeedbackCompleted);
