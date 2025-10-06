import React, { useState, useEffect, useCallback } from 'react';
import { Message, Sender } from './types';
import { getMessages, setMessages } from './state';
import { TrashIcon, PlusIcon, KebabIcon } from './components/Icons';

const EditorApp: React.FC = () => {
  const [editedMessages, setEditedMessages] = useState<Message[]>(getMessages);
  const [isDirty, setIsDirty] = useState(false);

  const handleStorageChange = useCallback(() => {
    setEditedMessages(getMessages());
    setIsDirty(false);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  const updateMessages = (newMessages: Message[]) => {
    setEditedMessages(newMessages);
    setIsDirty(true);
  };
  
  const handleMessageChange = (index: number, newText: string) => {
    const updatedMessages = [...editedMessages];
    updatedMessages[index].text = newText;
    updateMessages(updatedMessages);
  };
  
  const handleSenderChange = (index: number, newSender: Sender) => {
    const updatedMessages = [...editedMessages];
    updatedMessages[index].sender = newSender;
    updateMessages(updatedMessages);
  };

  const handleDeleteMessage = (index: number) => {
    const updatedMessages = editedMessages.filter((_, i) => i !== index);
    updateMessages(updatedMessages);
  };

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: 'New message...',
      sender: Sender.USER,
    };
    updateMessages([...editedMessages, newMessage]);
  };
  
  const handlePublish = () => {
    setMessages(editedMessages);
    setIsDirty(false);
  };
  
  const handleReset = () => {
    setEditedMessages(getMessages());
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <header className="py-4 px-6 border-b border-gray-700 shadow-lg flex items-center justify-between bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <KebabIcon />
          <div>
            <h1 className="text-2xl font-bold text-red-400 tracking-wider">Kebab AI</h1>
            <p className="text-xs text-gray-400">Conversation Editor</p>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-3">
        {editedMessages.map((msg, index) => (
          <div key={msg.id} className="p-3 bg-gray-800 rounded-md border border-gray-700 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <select 
                  value={msg.sender}
                  onChange={(e) => handleSenderChange(index, e.target.value as Sender)}
                  className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                  <option value={Sender.USER}>User</option>
                  <option value={Sender.AI}>AI</option>
              </select>
              <button
                onClick={() => handleDeleteMessage(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete message"
              >
                <TrashIcon />
              </button>
            </div>
            <textarea
              value={msg.text}
              onChange={(e) => handleMessageChange(index, e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 resize-y"
              rows={3}
            />
          </div>
        ))}
        <button
          onClick={handleAddMessage}
          className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-md hover:bg-gray-700 hover:border-gray-500 transition-colors"
        >
          <PlusIcon />
          <span>Add Message</span>
        </button>
      </main>

      <footer className="p-4 border-t border-gray-700 flex justify-end items-center space-x-3 bg-gray-900 sticky bottom-0 z-10">
        <span className={`text-sm transition-opacity ${isDirty ? 'opacity-100' : 'opacity-0'} text-yellow-400`}>Unpublished changes</span>
        <button
          onClick={handleReset}
          disabled={!isDirty}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={handlePublish}
          disabled={!isDirty}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publish Changes
        </button>
      </footer>
    </div>
  );
};

export default EditorApp;
