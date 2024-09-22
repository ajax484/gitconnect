"use server";
import { ID } from "@/lib/appWrite";
import { createDatabaseClient, getLoggedInUser } from "@/lib/server/appWrite";
import { createPostSchema } from "@/schemas/posts";
import {
  CommentData,
  CommentsPage,
  PostData,
  PostsPage,
} from "@/typings/posts";
import { Query } from "node-appwrite";
import { fetchUser } from "./users";

export async function deletePost(id: string) {
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  const post = await database.getDocument("database", "posts", id);

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.$id) throw new Error("Unauthorized");

  await database.deleteDocument("database", "posts", id);

  const thisUser = await fetchUser(post.userId);
  const commentsCount = (
    await database.listDocuments<CommentData>("database", "comments", [
      Query.equal("postId", post.$id),
    ])
  ).total;

  const deletedPost = {
    ...post,
    user: thisUser,
    comments: commentsCount,
  };

  return deletedPost;
}

export async function submitPost(input: { content: string; userId: string }) {
  console.log("here");
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();
  console.log(database, "database");

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse(input);

  try {
    // Create a new post
    const newPost = await database.createDocument(
      "database",
      "posts",
      ID.unique(),
      {
        content,
        userId: user.$id,
      }
    );

    const thisUser = await fetchUser(newPost.userId);
    const commentsCount = (
      await database.listDocuments<CommentData>("database", "comments", [
        Query.equal("postId", newPost.$id),
      ])
    ).total;

    const postWithDetails = {
      ...newPost,
      user: thisUser,
      comments: commentsCount,
    };

    return postWithDetails;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

export async function fetchPosts(cursor?: string | null): Promise<PostsPage> {
  const pageSize = 10;

  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch posts with optional pagination cursor
  const posts = await database.listDocuments<PostData>("database", "posts", [
    Query.orderDesc("$createdAt"),
    Query.limit(pageSize + 1),
    ...(cursor ? [Query.cursorAfter(cursor)] : []),
  ]);

  // Determine the next cursor for pagination
  const nextCursor =
    posts.documents.length > pageSize ? posts.documents[pageSize].id : null;

  const postsWithUsers = await Promise.all(
    posts.documents.slice(0, pageSize).map(async (post) => {
      const user = await fetchUser(post.userId);
      const comments = await database.listDocuments<CommentData>(
        "database",
        "comments",
        [Query.equal("postId", post.$id)]
      );
      return { ...post, user, comments: comments.total } satisfies PostData;
    })
  );

  const data: PostsPage = {
    posts: postsWithUsers,
    nextCursor,
  };

  return data;
}

export async function fetchUserPosts(
  userId: string,
  cursor?: string | null
): Promise<PostsPage> {
  const pageSize = 10;

  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch posts with optional pagination cursor
  const posts = await database.listDocuments<PostData>("database", "posts", [
    Query.equal("userId", userId),
    Query.orderDesc("$createdAt"),
    Query.limit(pageSize + 1),
    ...(cursor ? [Query.cursorAfter(cursor)] : []),
  ]);

  // Determine the next cursor for pagination
  const nextCursor =
    posts.documents.length > pageSize ? posts.documents[pageSize].id : null;

  const postsWithUsers = await Promise.all(
    posts.documents.slice(0, pageSize).map(async (post) => {
      const user = await fetchUser(post.userId);
      const comments = await database.listDocuments<CommentData>(
        "database",
        "comments",
        [Query.equal("postId", post.$id)]
      );

      return { ...post, user, comments: comments.total } satisfies PostData;
    })
  );

  const data: PostsPage = {
    posts: postsWithUsers,
    nextCursor,
  };

  return data;
}

export async function togglePostLike(postId: string): Promise<PostData> {
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  const post = await database.getDocument<PostData>(
    "database",
    "posts",
    postId
  );

  if (!post) throw new Error("this post doesn't exist");

  const updatedPost = await database.updateDocument<PostData>(
    "database",
    "posts",
    postId,
    {
      likes: post.likes
        ? post.likes.includes(user.$id)
          ? post.likes.filter((userId) => userId !== user.$id)
          : [...post.likes, user.$id]
        : [],
    }
  );

  return updatedPost;
}

export async function fetchPostById(postId: string): Promise<PostData> {
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch the specific post by its postId
  const post = await database.getDocument<PostData>(
    "database",
    "posts",
    postId
  );

  if (!post) throw new Error("Post not found");

  // Fetch the associated user for the post
  const postUser = await fetchUser(post.userId);

  const comments = await database.listDocuments<CommentData>(
    "database",
    "comments",
    [Query.equal("postId", post.$id)]
  );

  // Return the post along with its user information
  return { ...post, user: postUser, comments: comments.total };
}

export async function fetchPostComments(
  postId: string,
  cursor?: string | null
): Promise<CommentsPage> {
  const pageSize = 10;

  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  const comments = await database.listDocuments<CommentData>(
    "database",
    "comments",
    [
      Query.equal("postId", postId),
      Query.orderDesc("$createdAt"),
      Query.limit(pageSize + 1),
      ...(cursor ? [Query.cursorAfter(cursor)] : []),
    ]
  );

  const nextCursor =
    comments.documents.length > pageSize
      ? comments.documents[pageSize].id
      : null;

  const commentsWithUsers = await Promise.all(
    comments.documents.slice(0, pageSize).map(async (comment) => {
      const user = await fetchUser(comment.userId);

      return { ...comment, user };
    })
  );

  const data: CommentsPage = {
    comments: commentsWithUsers,
    nextCursor,
  };

  return data;
}

export async function submitComment(input: {
  content: string;
  postId: string;
}): Promise<CommentData> {
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  const { content, postId } = input;

  try {
    // Create a new post
    const newComment = await database.createDocument<CommentData>(
      "database",
      "comments",
      ID.unique(),
      {
        content,
        userId: user.$id,
        postId,
      }
    );

    const thisUser = await fetchUser(user.$id);

    return { ...newComment, user: thisUser };
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}

export async function deleteComment(id: string) {
  const { database } = await createDatabaseClient();

  const user = await getLoggedInUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const comment = await database.getDocument("database", "comments", id);

    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== user.$id) throw new Error("Unauthorized");

    await database.deleteDocument("database", "comments", id);

    return comment;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
}
