"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router";
import { ProfileProvider } from "@/providers/profile-provider"; // Adjust the import path accordingly
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Something went wrong");
        console.log(user);
        //may need to change
        //redirect("/");
        return null;
      }

      const response = await fetch(`/api/profile?userId=${user.id}`);
      if (!response.ok) {
        toast.error("Something went wrong");
        console.log(user);
        //router.push("/");
        //return;
      }

      const profile = await response.json();

      setProfile(profile);
    };

    fetchProfile();

    const signOut = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (!error) {
        router.push("/login");
        return;
      }

      setProfile(null);
    };

    signOut();
  }, [router]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
};

export default AuthProvider;
