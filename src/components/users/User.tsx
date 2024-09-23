"use client";
import { useUser } from "@/providers/UserProvider";
import { FollowerInfo } from "@/typings/followers";
import { UserData } from "@/typings/user";
import React from "react";
import FollowButton from "../FollowButton";

import UserAvatar from "../UserAvatar";
import Link from "next/link";

const User = ({ user }: { user: UserData }) => {
  const { user: loggedInUser } = useUser();

  if (!loggedInUser) return null;

  const followerState: FollowerInfo = {
    followers: user.followers.length,
    isFollowedByUser: !!user.following.some(
      (followerId) => followerId === loggedInUser.$id
    ),
    following: user.following.length,
    isFollowingUser: !!user.followers.some(
      (followingId) => followingId === loggedInUser.$id
    ),
  };

  console.log(followerState, user.followers, user.following, user.displayName);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-2 md:p-5 shadow-sm">
      <div className="flex flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <Link href={`/${user.username}`}>
              <UserAvatar size={48} avatar={user.avatar} />
            </Link>
            <div>
              <Link href={`/${user.username}`}>
                <div className="md:text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="flex items-center gap-0.5 md:gap-2">
                  <div className="text-muted-foreground text-sm md:text-base truncate">
                    @{user.username}
                  </div>
                  {followerState.isFollowedByUser && (
                    <span className="bg-secondary text-muted-foreground h-full p-1 flex items-center justify-center rounded-md text-xs flex-1">
                      follows you
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
          {loggedInUser.$id !== user.$id && (
            <FollowButton userId={user.$id} initialState={followerState} />
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
