import React, { createContext, useContext, useState, useEffect } from 'react';
import { contacts as initialContactsData } from '../data/mockData';
import { UserProfile } from '../types';

export interface LocalContactDetails {
  user_id: string;
  nickname?: string;
  custom_display_name?: string;
  notes?: string;
}

interface ContactContextType {
  contacts: Record<string, LocalContactDetails>;
  getContact: (userId: string) => LocalContactDetails | undefined;
  updateContact: (userId: string, updates: Partial<LocalContactDetails>) => void;
  deleteContact: (userId: string) => void;
  getEffectiveDisplayName: (user: Partial<UserProfile> | { id: string; name?: string; display_name?: string; username?: string }) => string;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Record<string, LocalContactDetails>>(() => {
    const saved = localStorage.getItem('rovela_local_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialContactsData;
      }
    }
    return initialContactsData;
  });

  useEffect(() => {
    localStorage.setItem('rovela_local_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const getContact = (userId: string): LocalContactDetails | undefined => {
    return contacts[userId];
  };

  const updateContact = (userId: string, updates: Partial<LocalContactDetails>) => {
    setContacts((prev) => {
      const existing = prev[userId] || { user_id: userId };
      return {
        ...prev,
        [userId]: {
          ...existing,
          ...updates,
          user_id: userId,
        },
      };
    });
  };

  const deleteContact = (userId: string) => {
    setContacts((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
  };

  const getEffectiveDisplayName = (
    user: Partial<UserProfile> | { id: string; name?: string; display_name?: string; username?: string }
  ): string => {
    if (!user.id) return user.name || user.display_name || 'User';
    const local = contacts[user.id];
    if (local?.custom_display_name?.trim()) {
      return local.custom_display_name.trim();
    }
    if (local?.nickname?.trim()) {
      return local.nickname.trim();
    }
    return user.display_name || user.name || (user.username ? `@${user.username}` : 'User');
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        getContact,
        updateContact,
        deleteContact,
        getEffectiveDisplayName,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};
