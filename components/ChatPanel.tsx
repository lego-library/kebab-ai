
import React, { useRef, useEffect } from 'react';
import { Message, Sender } from '../types';
import { MessageBox } from './MessageBox';
import { MessageInput } from './MessageInput';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <MessageBox
            key={msg.id}
            message={msg}
            isOwnMessage={msg.sender === Sender.USER}
          />
        ))}
        {isLoading && <ThinkingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
