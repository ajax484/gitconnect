"use client";
import { UserData } from "@/typings/user";
import React, { createContext, useContext } from "react";

interface UserContext {
  user: UserData | null;
}

const UserContext = createContext<UserContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: { user: UserData } }>) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContext {
  const context = useContext(UserContext);
  if (!context) {
    return { user: null };
    // throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
