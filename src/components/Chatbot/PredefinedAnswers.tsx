import React from 'react';
import { IAnswerPlaceholder } from './QuestionTypes';

export interface IPredefinedAnswers {
  possibleAnswers: Array<IAnswerPlaceholder>;
  onAnswerSelected: Function;
  disabledAnswers: boolean;
}

const PredefinedAnswers: React.FC<IPredefinedAnswers> = ({
  possibleAnswers,
  onAnswerSelected,
  disabledAnswers
}) => {
  return (
    <div className="b-chatBot__answerWrapper">
      {possibleAnswers.map(answer => {
        return (
          <button
            disabled={disabledAnswers}
            key={answer.id}
            className="answer b-chatBot__answer"
            onClick={() => onAnswerSelected(answer)}
            value={answer.text}
          >
            {answer.text}
          </button>
        );
      })}
    </div>
  );
};

export default PredefinedAnswers;
