import { UserData } from "@/typings/user";

export const DEFAULT_USER: UserData = {
  id: "", // This would be generated dynamically, e.g., UUID
  username: "default_username", // You would replace this with actual data
  displayName: "Default Display Name",
  email: "email@email.com", // Optional, set to null by default
  passwordHash: null, // Optional, set to null by default
  googleId: null, // Optional, set to null by default
  avatarUrl: "", // Default avatar URL
  bio: "This user has no bio.", // Default bio
  sessions: [], // Empty array to start
  posts: [], // Empty array to start
  following: [], // Empty array for following relationships
  followers: [], // Empty array for followers relationships
  likes: [], // Empty array for likes
  bookmarks: [], // Empty array for bookmarks
  comments: [], // Empty array for comments
  receivedNotifications: [], // Empty array for received notifications
  issuedNotifications: [], // Empty array for issued notifications
};
