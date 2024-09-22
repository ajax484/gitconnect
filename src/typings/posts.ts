import { Models } from "node-appwrite";
import { UserData } from "./user";

export interface PostData extends Models.Document {
  content: string;
  userId: string;
  comments: number;
  user: UserData;
  likes: string[];
}

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface LikeInfo {
  likes: string[];
  isLikedByUser: boolean;
}

export interface CommentData extends Models.Document {
  postId: string;
  content: string;
  userId: string;
  user: UserData;
}

export interface CommentsPage {
  comments: CommentData[];
  nextCursor: string | null;
}
