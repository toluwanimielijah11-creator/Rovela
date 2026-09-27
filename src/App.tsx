import React from 'react';
import { ToastProvider } from './context/ToastProvider';
import { ProfileProvider } from './context/ProfileContext';
import { ContactProvider } from './context/ContactContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { AdminProvider } from './context/AdminContext';
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
      <ProfileProvider>
        <ContactProvider>
          <ChatProvider>
            <AdminProvider>
              <MainContainer />
            </AdminProvider>
          </ChatProvider>
        </ContactProvider>
      </ProfileProvider>
    </ToastProvider>
  );
}
