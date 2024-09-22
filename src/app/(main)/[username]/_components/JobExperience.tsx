"use client";
import { UserData } from "@/typings/user";
import { format } from "date-fns";
import React from "react";

const JobExperience = ({ user }: { user: UserData }) => {
  return (
    <div className="flex-1 w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-xl font-bold">Job Experience</h3>
      {user.experiences && user.experiences.length > 0 ? (
        user.experiences.map((experience) => (
          <div className="space-y-2">
            <h4 className="text-lg font-bold capitalize">
              {experience.jobTitle}, {experience.company}
            </h4>
            <div className="text-muted-foreground">
              {format(experience.from, "PPP")} - {format(experience.to, "PPP")}
            </div>
            <p className="line-clamp-4 whitespace-pre-line">{user.bio}</p>
          </div>
        ))
      ) : (
        <p>No experience</p>
      )}
    </div>
  );
};

export default JobExperience;
