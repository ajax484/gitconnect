import { createDatabaseClient, getLoggedInUser } from "@/lib/server/appWrite";
import { LikeInfo } from "@/typings/posts";
import { Query } from "node-appwrite";

export async function getPostLikes(postId: string): Promise<LikeInfo> {
  const { database } = await createDatabaseClient();

  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const likeCount = (
    await database.listDocuments("database", "likes", [
      Query.equal("postId", postId),
    ])
  ).;

  return {
    likes: likeCount,
    isLikedByUser: likes.documents.length > 0,
  };
}
