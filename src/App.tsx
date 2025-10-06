import React, { useState, useCallback, useEffect } from 'react';
import { ChatPanel } from '../components/ChatPanel';
import { Sender, Message } from '../types';
import { KebabIcon } from '../components/Icons';
import { GoogleGenAI } from "@google/genai";
import type { Content } from "@google/genai";
import { getMessages, setMessages } from '../state';

// Make sure to set your Gemini API key in Vite/CRA env (.env file)
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) console.warn('Warning: GEMINI_API_KEY is not set. AI responses will fail.');

const ai = new GoogleGenAI({ apiKey });

const convertMessagesToGeminiHistory = (messages: Message[]): Content[] => {
  const history = messages[0]?.id === 'init' ? messages.slice(1) : messages;
  return history.map(msg => ({
    role: msg.sender === Sender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};

const App: React.FC = () => {
  const [messages, setLocalMessages] = useState<Message[]>(getMessages());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => setLocalMessages(getMessages());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const currentMessages = getMessages();
    const userMessage: Message = { id: Date.now().toString() + Sender.USER, text, sender: Sender.USER };
    const updatedMessages = [...currentMessages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const contents = convertMessagesToGeminiHistory(updatedMessages);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      const aiMessage: Message = {
        id: Date.now().toString() + Sender.AI,
        text: response.text,
        sender: Sender.AI,
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      console.error('Error generating content:', err);
      const errorMessage: Message = {
        id: Date.now().toString() + Sender.AI,
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: Sender.AI,
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleFooterDoubleClick = () => {
    alert('Conversation Data:\n\n' + JSON.stringify(messages, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <header className="py-4 px-6 border-b border-gray-700 shadow-lg flex items-center justify-between bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <KebabIcon />
          <div>
            <h1 className="text-2xl font-bold text-red-400 tracking-wider">Kebab AI</h1>
            <p className="text-xs text-gray-400">Chat View</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl h-full">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer
        onDoubleClick={handleFooterDoubleClick}
        className="text-center p-4 text-xs text-gray-500 border-t border-gray-800 cursor-pointer hover:text-gray-400 transition-colors"
        title="Double-click to view conversation data"
      >
        Powered by Gemini
      </footer>
    </div>
  );
};

export default App;
