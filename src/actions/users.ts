"use server";
import { createDatabaseClient, getLoggedInUser } from "@/lib/server/appWrite";
import {
  createUserProfileSchema,
  EducationSchema,
  jobExperienceSchema,
  updateUserProfileSchema,
} from "@/schemas/user";
import {
  createUserProfileValues,
  EducationValues,
  jobExperienceValues,
  UpdateUserProfileValues,
  UserData,
  UsersPage,
} from "@/typings/user";
import { Query } from "node-appwrite";
import { FollowerData } from "@/typings/followers";

export async function fetchUser(userId: string): Promise<UserData> {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) throw new Error("Unauthorized");

    const { database } = await createDatabaseClient();

    const user = await database.getDocument<UserData>(
      "database",
      "users",
      userId
    );

    const followersCount = await database.listDocuments<FollowerData>(
      "database",
      "followers",
      [Query.equal("followingId", user.$id)]
    );

    const followingCount = await database.listDocuments<FollowerData>(
      "database",
      "followers",
      [Query.equal("followerId", user.$id)]
    );

    return {
      ...user,
      education: JSON.parse(user.education),
      experiences: JSON.parse(user.experiences),
      followers: followersCount.documents.map(({ followingId }) => followingId),
      following: followingCount.documents.map(({ followerId }) => followerId),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

export async function fetchUserByValue(
  key: string,
  value: string
): Promise<UserData> {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) throw new Error("Unauthorized");

    const { database } = await createDatabaseClient();

    const user = (
      await database.listDocuments<UserData>("database", "users", [
        Query.equal(key, value),
      ])
    ).documents[0];

    const followersCount = await database.listDocuments<FollowerData>(
      "database",
      "followers",
      [Query.equal("followingId", user.$id)]
    );

    const followingCount = await database.listDocuments<FollowerData>(
      "database",
      "followers",
      [Query.equal("followerId", user.$id)]
    );

    return {
      ...user,
      education: JSON.parse(user.education),
      experiences: JSON.parse(user.experiences),
      followers: followersCount.documents.map(({ followerId }) => followerId),
      following: followingCount.documents.map(({ followingId }) => followingId),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const { database } = await createDatabaseClient();

  // Perform the update and return only the updated user data
  const updatedUser = await database.updateDocument<UserData>(
    "database",
    "users",
    loggedInUser.$id,
    validatedValues
  );

  return {
    $id: updatedUser.$id,
    displayName: updatedUser.displayName,
    bio: updatedUser.bio,
    avatarUrl: updatedUser.avatarUrl || null,
  };
}

export async function updateEducationProfile(values: EducationValues) {
  const validatedValues = EducationSchema.parse(values);
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const { database } = await createDatabaseClient();

  // Perform the update and return only the updated user data
  const updatedUser = await database.updateDocument<UserData>(
    "database",
    "users",
    loggedInUser.$id,
    { education: JSON.stringify(validatedValues.education) }
  );

  // Return only the necessary parts of the updatedUser, stripping away non-serializable properties
  return {
    $id: updatedUser.$id,
    displayName: updatedUser.displayName,
    bio: updatedUser.bio,
    avatarUrl: updatedUser.avatarUrl || null, // Ensure avatarUrl is a simple string or null
  };
}

export async function updateExperienceProfile(values: jobExperienceValues) {
  const validatedValues = jobExperienceSchema.parse(values);
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const { database } = await createDatabaseClient();

  const updatedUser = await database.updateDocument<UserData>(
    "database",
    "users",
    loggedInUser.$id,
    { experiences: JSON.stringify(validatedValues.experiences) }
  );

  return {
    $id: updatedUser.$id,
    displayName: updatedUser.displayName,
    bio: updatedUser.bio,
    avatarUrl: updatedUser.avatarUrl || null,
  };
}

export async function createUserProfile(values: createUserProfileValues) {
  const validatedValues = createUserProfileSchema.parse(values);
  const { username } = validatedValues;
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const { database } = await createDatabaseClient();

  const existingUsername = await database.listDocuments("database", "users", [
    Query.equal("username", username),
  ]);

  if (existingUsername.total > 0) throw new Error("Username is taken");

  const name = loggedInUser.name.split(" ");

  // Perform the update and return only the updated user data
  const updatedUser = await database.createDocument<UserData>(
    "database",
    "users",
    loggedInUser.$id,
    {
      ...validatedValues,
      firstName: name[0],
      lastName: name[1],
      email: loggedInUser.email,
    }
  );

  return {
    $id: updatedUser.$id,
    displayName: updatedUser.displayName,
    bio: updatedUser.bio,
    avatarUrl: updatedUser.avatarUrl || null,
  };
}

export async function fetchUsers(cursor?: string | null): Promise<UsersPage> {
  const pageSize = 10;

  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch posts with optional pagination cursor
  const posts = await database.listDocuments<UserData>("database", "users", [
    Query.notEqual("$id", user.$id),
    Query.orderDesc("$createdAt"),
    Query.limit(pageSize + 1),
    ...(cursor ? [Query.cursorAfter(cursor)] : []),
  ]);

  // Determine the next cursor for pagination
  const nextCursor =
    posts.documents.length > pageSize ? posts.documents[pageSize].id : null;

  const usersWithFollowers = await Promise.all(
    posts.documents.slice(0, pageSize).map(async (thisUser) => {
      const followersCount = await database.listDocuments<FollowerData>(
        "database",
        "followers",
        [Query.equal("followingId", thisUser.$id)]
      );

      const followingCount = await database.listDocuments<FollowerData>(
        "database",
        "followers",
        [Query.equal("followerId", thisUser.$id)]
      );

      return {
        ...thisUser,
        education: JSON.parse(thisUser.education),
      experiences: JSON.parse(thisUser.experiences),
        followers: followersCount.documents.map(({ followerId }) => followerId),
        following: followingCount.documents.map(
          ({ followingId }) => followingId
        ),
      };
    })
  );

  const data: UsersPage = {
    users: usersWithFollowers,
    nextCursor,
  };

  return data;
}
