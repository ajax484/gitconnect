"use client";
import React from "react";
import { UserData } from "@/typings/user";
import UserProvider from "../../providers/UserProvider";
import Navbar from "./_components/Navbar";
import MenuBar from "./_components/Menubar";

const MainLayout = ({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) => {
  return (
    <UserProvider value={{ user }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </UserProvider>
  );
};

export default MainLayout;
