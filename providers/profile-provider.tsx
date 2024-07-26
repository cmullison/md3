"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileProviderProps {
  children: ReactNode;
  profile: Profile;
}

const ProfileContext = createContext<Profile | null>(null);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  profile,
}) => {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};
