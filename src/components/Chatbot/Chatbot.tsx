import React, { useEffect, useState, useRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { postUserAnswer, IAnswerPayload } from '../../api/api';
import './Chatbot.scss';
import Message, { IMessage } from './Message';
import PredefinedAnswers from './PredefinedAnswers';
import { IAnswerPlaceholder, IQuestion } from './QuestionTypes';
import TextInput from './TextInput';
import { useStateValue } from '../../store/store';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

type InputMethod = 'text_input' | 'predefined_answer' | 'button_prompt';

interface IChatbot extends RouteComponentProps {
  questionList: Array<IQuestion>;
}

const NICKNAME_PLACEHOLDER = '{{nickname}}';
const SESSION_TITLE_PLACEHOLDER = '{{title}}';
const COACH_NAME_PLACEHOLDER = '{{coach}}';

const Chatbot: React.FC<IChatbot> = ({ history, questionList }) => {
  console.log(questionList);
  const [messageStack, setMessageStack] = useState<Array<IMessage>>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userNickname, setUserNickname] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('text_input');
  const [predefinedAnswersToShow, setPredefinedAnswersToShow] = useState<
    Array<IAnswerPlaceholder>
  >([]);
  const [buttonText, setButtonText] = useState<string>('');
  const [showMessageLengthWarning, setShowMessageLengthWarning] = useState<
    boolean
  >(false);
  const messagesEndRef = useRef(document.createElement('div'));
  const { state } = useStateValue();
  const { collectContactData } = state.sessionData;

  const SESSION_NAME = state.sessionData.sessionName;
  const COACH_NAME = state.sessionData.coachName;

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messageStack]);

  const handleUserAnswerPosting = (userAnswer: string | IAnswerPlaceholder) => {
    setIsBotTyping(true);
    saveUserAnswer(userAnswer)
      .then(() => {
        goToNextQuestion();
        setIsBotTyping(false);
      })
      .catch(e => {
        console.log('Error posting user answer: ', e, e.response);
        setIsBotTyping(false);
        goToNextQuestion();
      });
  };

  const onTextInputSubmit = () => {
    displayUserMessage(inputValue);
    const activeQuestion = questionList[activeQuestionIndex];
    if (activeQuestion.is_name_prompt) {
      setUserNickname(inputValue);
      goToNextQuestion();
    } else {
      const activeQuestion = questionList[activeQuestionIndex];
      if (!activeQuestion.is_prompt) {
        handleUserAnswerPosting(inputValue);
      }
      goToNextQuestion();
    }
  };

  const onPredefinedAnswerSubmit = (answer: IAnswerPlaceholder) => {
    const activeQuestion = questionList[activeQuestionIndex];
    if (!activeQuestion.is_prompt) {
      handleUserAnswerPosting(answer);
    } else {
      goToNextQuestion();
    }
  };

  const renderIputMethod = () => {
    if (isBotTyping) {
      return (
        <div className="b-chatBot__answerWrapper">
          <span className="b-chatBot__typing">Chatbot is typing...</span>
        </div>
      );
    }
    if (inputMethod === 'text_input') {
      return (
        <div>
          {showMessageLengthWarning && (
            <span className="b-chatBot__warning b-chatBot__warning--red">
              300 character limit
            </span>
          )}
          <TextInput
            isInputDisabled={isInputDisabled}
            inputValue={inputValue}
            onInputChange={(text: string) => {
              if (text.length > 300) {
                setShowMessageLengthWarning(true);
              } else {
                setShowMessageLengthWarning(false);
              }
              setInputValue(text.slice(0, 300));
            }}
            onInputSubmit={onTextInputSubmit}
          />
        </div>
      );
    }
    if (inputMethod === 'button_prompt') {
      return (
        <div className="b-chatBot__answerWrapper">
          <button
            className="b-chatBot__answer b-chatBot__answer--single"
            onClick={() => {
              displayUserMessage(buttonText);
              goToNextQuestion();
            }}
          >
            {buttonText}
          </button>
        </div>
      );
    }
    return (
      <div>
        <span className="b-chatBot__warning">
          Choose the appropriate statement
        </span>
        <PredefinedAnswers
          disabledAnswers={isInputDisabled}
          possibleAnswers={predefinedAnswersToShow}
          onAnswerSelected={(answer: IAnswerPlaceholder) => {
            displayUserMessage(answer.text);
            onPredefinedAnswerSubmit(answer);
          }}
        />
      </div>
    );
  };

  const askQuestion = (): void => {
    const question: IQuestion = questionList[activeQuestionIndex];
    handleDisplayingBotMessage(question);
    if (question.skip_answer) {
      goToNextQuestion();
    } else {
      setIsInputDisabled(false);
    }
  };

  const setInputMethodBasedOnMessageType = (message: IQuestion) => {
    if (message.answer_placeholders && message.answer_placeholders.length > 0) {
      setInputMethod('predefined_answer');
      setPredefinedAnswersToShow(message.answer_placeholders);
    } else if (message.button_text) {
      setInputMethod('button_prompt');
      setButtonText(message.button_text);
    } else {
      setInputMethod('text_input');
    }
  };

  const handleDisplayingBotMessage = (message: IQuestion) => {
    let personalMessage = '';
    if (
      message.text.includes(NICKNAME_PLACEHOLDER) ||
      message.text.includes(
        COACH_NAME_PLACEHOLDER ||
          message.text.includes(SESSION_TITLE_PLACEHOLDER)
      )
    ) {
      if (userNickname && userNickname.trim().length > 0) {
        console.log('provided nickname: ');
        personalMessage = message.text.replace(
          NICKNAME_PLACEHOLDER,
          userNickname
        );
      } else {
        const splitMessage = message.text.split('.');
        splitMessage.forEach((messagePart: string) => {
          let personalized = '';
          if (messagePart.includes(NICKNAME_PLACEHOLDER)) {
            personalized =
              messagePart.replace(NICKNAME_PLACEHOLDER, '').trim() + '.';
            personalized = personalized.replace(',', '').trim();
          } else {
            personalized = messagePart;
          }
          personalMessage += personalized;
        });
      }

      personalMessage = personalMessage.replace(
        COACH_NAME_PLACEHOLDER,
        COACH_NAME
      );
      personalMessage = personalMessage.replace(
        SESSION_TITLE_PLACEHOLDER,
        SESSION_NAME
      );
      displayBotMessage(personalMessage);
    } else {
      displayBotMessage(message.text);
    }
    setInputMethodBasedOnMessageType(message);
  };

  useEffect((): void => {
    if (!questionList || questionList.length <= 0) {
      history.push('/');
    }
    if (activeQuestionIndex < questionList.length) {
      askQuestion();
    } else {
      if (collectContactData) {
        history.push('/complete');
      } else {
        history.push('/finished');
      }
    }
    // eslint-disable-next-line
  }, [activeQuestionIndex]);

  const renderMessages = (): Array<object> => {
    return messageStack.map((message, index) => (
      <Message
        key={index}
        message={message.message}
        sender={message.sender}
        isFirstMessage={index === 0}
      />
    ));
  };

  const saveUserAnswer = async (
    userAnswer: IAnswerPlaceholder | string
  ): Promise<any> => {
    const activeQuestion: IQuestion = questionList[activeQuestionIndex];
    const { type: questionType, id } = activeQuestion;
    const answerPayload: IAnswerPayload = {
      text: '',
      answer_placeholder: null,
      uuid: ''
    };
    if (
      questionType === 'choice_question' ||
      questionType === 'rating_question'
    ) {
      const placeholderAnswer = userAnswer as IAnswerPlaceholder;
      answerPayload.text = placeholderAnswer.text;
      answerPayload.answer_placeholder = { id: placeholderAnswer.id };
    } else {
      answerPayload.text = userAnswer as string;
    }
    await postUserAnswer(
      { ...answerPayload, uuid: state.sessionData.uuid },
      id
    );
  };

  const goToNextQuestion = () => {
    setActiveQuestionIndex(prevIndex => prevIndex + 1);
  };

  const displayUserMessage = (message: string = ''): void => {
    if (message.length > 0) {
      setIsInputDisabled(true);
      const userMessage: IMessage = {
        message: `${message}`,
        sender: 'user',
        isFirstMessage: false
      };
      setMessageStack(prevStack => [...prevStack, userMessage]);
      setInputValue('');
    }
  };

  const displayBotMessage = (message: string): void => {
    const botMessage: IMessage = {
      message: `${message}`,
      sender: 'bot',
      isFirstMessage: false
    };
    setMessageStack(oldStack => [...oldStack, botMessage]);
  };

  return (
    <>
      <div className="b-chatBot__messages messages-container">
        {renderMessages()}
        {isBotTyping && <LoadingIndicator />}
      </div>
      {renderIputMethod()}
      <div ref={messagesEndRef} />
    </>
  );
};

export default withRouter(Chatbot);
