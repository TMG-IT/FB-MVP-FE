import React from 'react';
import Textarea from 'react-textarea-autosize';

interface ITextInput {
  isInputDisabled: boolean;
  inputValue: string;
  onInputChange: Function;
  onInputSubmit: Function;
}

const TextInput: React.FC<ITextInput> = ({
  isInputDisabled,
  inputValue,
  onInputChange,
  onInputSubmit
}) => {
  return (
    <div className="b-chatBot__answerWrapper">
      <div className="text-input-container b-chatBot__input">
        <Textarea
          type="text"
          maxRows={3}
          disabled={isInputDisabled}
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && inputValue.length <= 300) {
              onInputSubmit();
            }
          }}
        />
        <button
          disabled={inputValue.length > 300}
          onClick={() => onInputSubmit()}
        >
          <img
            src={require('../../assets/images/icon-send.svg')}
            className="b-chatBot__input_icon"
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default TextInput;
