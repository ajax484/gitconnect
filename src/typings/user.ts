import {
  createUserProfileSchema,
  EducationSchema,
  jobExperienceSchema,
  updateUserProfileSchema,
} from "@/schemas/user";
import { Models } from "node-appwrite";
import { z } from "zod";

export type jobExperienceValues = z.infer<typeof jobExperienceSchema>;
export type EducationValues = z.infer<typeof EducationSchema>;

export interface UserData
  extends Models.Document,
    EducationValues,
    jobExperienceValues {
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  firstName: string;
  lastName: string;
  following: string[];
  followers: string[];
  github: string;
}

export interface UsersPage {
  users: UserData[];
  nextCursor: string | null;
}

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
export type createUserProfileValues = z.infer<typeof createUserProfileSchema>;
