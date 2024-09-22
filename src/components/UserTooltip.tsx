"use client";

// import { useSession } from "@/app/(main)/SessionProvider";
// import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
// import FollowButton from "./FollowButton";
// import FollowerCount from "./FollowerCount";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/providers/UserProvider";
import { UserData } from "@/typings/user";
import Linkify from "./Linkify";
import FollowButton from "./FollowButton";
import { FollowerInfo } from "@/typings/followers";
import FollowerCount from "./FollowerCount";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex w-[250px] flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/${user.username}`}>
                <UserAvatar size={48} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.$id !== user.$id && (
                <FollowButton userId={user.$id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">@{user.username}</div>
                  {followerState.isFollowedByUser && (
                    <span className="bg-secondary text-muted-foreground h-full p-1 flex items-center justify-center rounded-md text-xs">
                      follows you
                    </span>
                  )}
                </div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
