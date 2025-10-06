import { Message, Sender } from './types';

const LOCAL_STORAGE_KEY = 'kebab_ai_conversation';

const initialMessages: Message[] = [
  {
    id: 'init',
    text: 'Hello! I am Kebab AI. How can I help you today?',
    sender: Sender.AI
  }
];

export const getMessages = (): Message[] => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : initialMessages;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return initialMessages;
  }
};

export const setMessages = (messages: Message[]): void => {
  try {
    const value = JSON.stringify(messages);
    const oldValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, value);
    // Dispatch a custom event to notify other tabs/windows immediately
    // This makes the sync faster than the native 'storage' event in some browsers
    window.dispatchEvent(new StorageEvent('storage', { 
        key: LOCAL_STORAGE_KEY, 
        newValue: value,
        oldValue: oldValue,
        storageArea: window.localStorage,
        url: window.location.href,
    }));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
};

// Initialize localStorage if it's empty
if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
  setMessages(initialMessages);
}
