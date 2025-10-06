import React from 'react';
import App from './src/App';
import EditorApp from './EditorApp';

const Main: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isEditorMode = urlParams.get('mode') === 'editor';

  if (isEditorMode) {
    return <EditorApp />;
  }
  
  return <App />;
};

export default Main;
