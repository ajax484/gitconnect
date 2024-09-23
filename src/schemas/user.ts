import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
  firstName: requiredString,
  lastName: requiredString,
  github: z.string().url().trim().min(1, "Required").optional(),
  avatar: z.string().optional().nullable(),
});

export const createUserProfileSchema = z.object({
  username: requiredString,
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
  github: z.string().url().trim().min(1, "Required"),
  avatar: z.string().optional().nullable(),
});

export const jobExperienceSchema = z.object({
  experiences: z.array(
    z
      .object({
        jobTitle: z.string().min(1, { message: "Job title is required" }),
        company: z.string().min(1, { message: "Company name is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        from: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Invalid start date",
        }),
        to: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Invalid end date",
        }),
      })
      .refine((data) => new Date(data.from) < new Date(data.to), {
        message: "'From' date must be earlier than 'To' date",
        path: ["to"],
      })
  ),
});

export const EducationSchema = z.object({
  education: z.array(
    z
      .object({
        degree: z.string().min(1, { message: "Job title is required" }),
        institution: z.string().min(1, { message: "Company name is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        from: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Invalid start date",
        }),
        to: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Invalid end date",
        }),
      })
      .refine((data) => new Date(data.from) < new Date(data.to), {
        message: "'From' date must be earlier than 'To' date",
        path: ["to"],
      })
  ),
});
