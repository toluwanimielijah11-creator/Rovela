import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { useToast } from './ToastContext';

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  copyRovelaId: () => void;
  isQrModalOpen: boolean;
  openQrModal: () => void;
  closeQrModal: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rovela_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CURRENT_USER;
      }
    }
    return CURRENT_USER;
  });

  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('rovela_user_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      name: updates.display_name || updates.name || prev.name,
      display_name: updates.display_name || updates.name || prev.display_name || prev.name,
      bio: updates.about || updates.bio || prev.bio,
      about: updates.about || updates.bio || prev.about || prev.bio,
    }));
  };

  const copyRovelaId = () => {
    const rovelaId = `@${profile.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rovelaId);
      showToast('Rovela ID copied to clipboard', rovelaId, 'success');
    }
  };

  const openQrModal = () => setIsQrModalOpen(true);
  const closeQrModal = () => setIsQrModalOpen(false);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        copyRovelaId,
        isQrModalOpen,
        openQrModal,
        closeQrModal,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
