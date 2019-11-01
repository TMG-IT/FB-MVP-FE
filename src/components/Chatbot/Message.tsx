import React from 'react';

export type ConversationActor = 'bot' | 'user';

export interface IMessage {
  message: string;
  sender: ConversationActor;
  isFirstMessage: boolean;
}

const Message: React.FC<IMessage> = ({ message, sender, isFirstMessage }) => {
  const renderMessage = () => {
    if (isFirstMessage) {
      let splitMessage = message.split('!');
      if (splitMessage.length > 0) {
        return splitMessage.map((messagePart, index) => {
          if (index === 0) {
            return (
              <h3 key={index} className="b-chatBot__message_title">
                {messagePart}
                {'!'}
              </h3>
            );
          }
          return <span key={index}>{messagePart}</span>;
        });
      }
    }
    return <span>{message}</span>;
  };

  return (
    <div
      className={`b-chatBot__message ${
        sender === 'user' ? 'b-chatBot__message-user' : 'b-chatBot__message-bot'
      }`}
    >
      {renderMessage()}
    </div>
  );
};

export default Message;
