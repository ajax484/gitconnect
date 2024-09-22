"use server";
import { createDatabaseClient, getLoggedInUser } from "@/lib/server/appWrite";
import { FollowerData, FollowerInfo } from "@/typings/followers";
import { ID, Query } from "node-appwrite";

export async function getUserFollowers(userId: string): Promise<FollowerInfo> {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  const { database } = await createDatabaseClient();

  const user = await database.getDocument("database", "users", userId);

  if (!user) {
    throw new Error("User not found");
  }

  const followersCount = await database.listDocuments<FollowerData>(
    "database",
    "followers",
    [Query.equal("followingId", userId)]
  );

  const followingCount = await database.listDocuments<FollowerData>(
    "database",
    "followers",
    [Query.equal("followerId", userId)]
  );

  const isFollowedByUser = !!followingCount.documents.find(
    ({ followingId }) => followingId === loggedInUser.$id
  );
  const isFollowingUser = !!followingCount.documents.find(
    ({ followerId }) => followerId === loggedInUser.$id
  );

  return {
    followers: followersCount.total,
    following: followingCount.total,
    isFollowedByUser,
    isFollowingUser,
  };
}

export async function followUser(userId: string) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  const { database } = await createDatabaseClient();

  console.log(userId, "userId");

  await database.createDocument("database", "followers", ID.unique(), {
    followerId: loggedInUser.$id,
    followingId: userId,
  });
}

export async function unfollowUser(userId: string) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  const { database } = await createDatabaseClient();

  const followers = await database.listDocuments("database", "followers", [
    Query.equal("followerId", loggedInUser.$id),
    Query.equal("followingId", userId),
  ]);

  await Promise.all(
    followers.documents.map(
      async (follower) =>
        await database.deleteDocument("database", "followers", follower.$id)
    )
  );
}
