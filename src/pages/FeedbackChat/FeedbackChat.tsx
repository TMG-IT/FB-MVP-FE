import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Chatbot from '../../components/Chatbot/Chatbot';
import { useStateValue } from '../../store/store';

interface IFeedbackChat extends RouteComponentProps {}

const FeedbackChat: React.FC<IFeedbackChat> = ({ history }) => {
  const {
    state: {
      sessionData: { questionList }
    }
  } = useStateValue();

  return (
    <div className="c-chatBot">
      <div className="container-m">
        <div className="b-chatBot">
          <Chatbot questionList={questionList} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(FeedbackChat);
