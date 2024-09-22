import { Models } from "node-appwrite";

export interface FollowerData extends Models.Document {
  followingId: string;
  followerId: string;
}

export interface FollowerInfo {
  followers: number;
  following: number;
  isFollowedByUser: boolean;
  isFollowingUser: boolean;
}
