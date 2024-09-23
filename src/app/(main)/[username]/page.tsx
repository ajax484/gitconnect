"use server";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserData } from "@/typings/user";
import EditProfileButton from "./_components/EditProfileButton";
import { getLoggedInUser } from "@/lib/server/appWrite";
import { fetchUserByValue } from "@/actions/users";
import FollowerCount from "@/components/FollowerCount";
import { FollowerInfo } from "@/typings/followers";
import FollowButton from "@/components/FollowButton";
import UserTabs from "./_components/UserTabs";
import { Link } from "lucide-react";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) return {};

  const user = await fetchUserByValue("username", username);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) return redirect("/login");

  const user = await fetchUserByValue("username", username);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.$id} />
        <UserTabs user={user} />
      </div>
      {/* <TrendsSidebar /> */}
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  //   const followerInfo: FollowerInfo = {
  //     followers: user._count.followers,
  //     isFollowedByUser: user.followers.some(
  //       ({ followerId }) => followerId === loggedInUserId
  //     ),
  //   };

  const loggedInUser = await getLoggedInUser();

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
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatar={user.avatar}
        size={240}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">@{user.username}</div>
              {followerState.isFollowedByUser && (
                <span className="bg-secondary text-muted-foreground h-full p-1 flex items-center justify-center rounded-md text-xs">
                  follows you
                </span>
              )}
            </div>
          </div>
          <div>
            Member since {formatDate(new Date(user.$createdAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {/* {formatNumber(user._count.posts)} */}10
              </span>
            </span>
          </div>
          <FollowerCount userId={user.$id} initialState={followerState} />
        </div>
        {user.$id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.$id} initialState={followerState} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
      {user.github && (
        <a
          href={user.github}
          className="flex gap-1 hover:underline text-muted-foreground hover:cursor-pointer items-center"
        >
          <Link size={12} />
          <span className="text-sm">Github</span>
        </a>
      )}
    </div>
  );
}
