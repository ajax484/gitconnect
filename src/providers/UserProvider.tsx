"use client";
import { UserData } from "@/typings/user";
import React, { createContext, useContext, useState } from "react";

interface UserContext {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: { user: UserData } }>) {
  const [thisUser, setUser] = useState<UserData | null>(value.user);

  return (
    <UserContext.Provider value={{ user: thisUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContext {
  const context = useContext(UserContext);
  if (!context) {
    return { user: null, setUser: () => {} };
  }
  return context;
}
