"use client";
import React from "react";
import { UserData } from "@/typings/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef } from "react";
import UserPosts from "./UserPosts";
import JobExperienceForm from "./forms/JobExperienceForm";
import EducationForm from "./forms/EducationForm";
import { useUser } from "@/providers/UserProvider";
import JobExperience from "./JobExperience";
import Education from "./Education";

const UserTabs = ({ user }: { user: UserData }) => {
  const { user: loggedInuser } = useUser();

  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!loggedInuser) return null;

  return (
    <Tabs
      defaultValue="posts"
      ref={contentRef}
      className="w-full flex flex-col gap-5"
    >
      <TabsList className="w-full mx-auto">
        <TabsTrigger
          value="posts"
          asChild
          className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <button type="button" onClick={scrollToContent}>
            {" "}
            Posts
          </button>
        </TabsTrigger>
        <TabsTrigger
          value="details"
          asChild
          className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <button type="button" onClick={scrollToContent}>
            Details
          </button>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="space-y-5">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              {user.displayName}&apos;s posts
            </h2>
          </div>
          <UserPosts userId={user.$id} />
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="space-y-5">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              {user.displayName}&apos;s Personal Details
            </h2>
          </div>
          <div className="space-y-5 w-full">
            {user.$id === loggedInuser.$id ? (
              <>
                <JobExperienceForm user={user} />
                <EducationForm user={user} />
              </>
            ) : (
              <>
                <JobExperience user={user} />
                <Education user={user} />
              </>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;
