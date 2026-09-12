import React from 'react';
import { ToastProvider } from './context/ToastProvider';
import { ChatProvider, useChat } from './context/ChatContext';
import { AppShell } from './components/layout/AppShell';
import { RovelaAuthJourney } from './components/auth/RovelaAuthJourney';

const MainContainer: React.FC = () => {
  const { isAuthenticated } = useChat();

  return isAuthenticated ? (
    <AppShell />
  ) : (
    <RovelaAuthJourney initialScreen="welcome" />
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ChatProvider>
        <MainContainer />
      </ChatProvider>
    </ToastProvider>
  );
}
