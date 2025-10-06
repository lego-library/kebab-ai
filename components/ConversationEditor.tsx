
import React, { useState, useEffect } from 'react';
import { Message, Sender } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface ConversationEditorProps {
  messages: Message[];
  onSave: (updatedMessages: Message[]) => void;
  onClose: () => void;
}

export const ConversationEditor: React.FC<ConversationEditorProps> = ({
  messages,
  onSave,
  onClose,
}) => {
  const [editedMessages, setEditedMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Deep copy to prevent modifying original state directly
    setEditedMessages(JSON.parse(JSON.stringify(messages)));
  }, [messages]);

  const handleMessageChange = (index: number, newText: string) => {
    const updatedMessages = [...editedMessages];
    updatedMessages[index].text = newText;
    setEditedMessages(updatedMessages);
  };
  
  const handleSenderChange = (index: number, newSender: Sender) => {
    const updatedMessages = [...editedMessages];
    updatedMessages[index].sender = newSender;
    setEditedMessages(updatedMessages);
  };

  const handleDeleteMessage = (index: number) => {
    const updatedMessages = editedMessages.filter((_, i) => i !== index);
    setEditedMessages(updatedMessages);
  };

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: 'New message...',
      sender: Sender.USER,
    };
    setEditedMessages([...editedMessages, newMessage]);
  };
  
  const handleSave = () => {
    onSave(editedMessages);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-gray-700">
        <header className="p-4 border-b border-gray-700">
          <h2 id="editor-title" className="text-xl font-bold text-red-400">Conversation Editor</h2>
          <p className="text-sm text-gray-400">Edit messages in real-time. Changes will be reflected in the chat.</p>
        </header>
        
        <main className="p-4 space-y-3 overflow-y-auto">
          {editedMessages.map((msg, index) => (
            <div key={msg.id} className="p-3 bg-gray-700/50 rounded-md border border-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <select 
                    value={msg.sender}
                    onChange={(e) => handleSenderChange(index, e.target.value as Sender)}
                    className="bg-gray-900 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 resize-y"
                rows={3}
              />
            </div>
          ))}
          <button
            onClick={handleAddMessage}
            className="w-full flex items-center justify-center space-x-2 p-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-md hover:bg-gray-700 hover:border-gray-500 transition-colors"
          >
            <PlusIcon />
            <span>Add Message</span>
          </button>
        </main>

        <footer className="p-4 border-t border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};
