
import React from 'react';
import { Message } from '../types';

interface MessageBoxProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ message, isOwnMessage }) => {
  const bubbleClasses = isOwnMessage
    ? 'bg-red-500 text-white rounded-br-none'
    : 'bg-gray-600 text-gray-200 rounded-bl-none';
  
  const containerClasses = isOwnMessage ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-md ${bubbleClasses}`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};
