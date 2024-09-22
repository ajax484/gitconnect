"use client";
import { UserData } from "@/typings/user";
import { format } from "date-fns";
import React from "react";

const Education = ({ user }: { user: UserData }) => {
  return (
    <div className="flex-1 w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-xl font-bold">Education</h3>
      {user.education && user.education.length > 0 ? (
        user.education.map((education, index) => (
          <div className="space-y-2" key={index}>
            <h4 className="text-lg font-bold capitalize">
              {education.degree}, {education.institution}
            </h4>
            <div className="text-muted-foreground">
              {format(education.from, "PPP")} - {format(education.to, "PPP")}
            </div>
            <p className="line-clamp-4 whitespace-pre-line">{user.bio}</p>
          </div>
        ))
      ) : (
        <p>No education</p>
      )}
    </div>
  );
};

export default Education;
