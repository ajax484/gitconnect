"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/typings/followers";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <div className="flex justify-between items-center w-full">
      <span>
        Followers: <span className="font-semibold">{data.followers}</span>
      </span>
      <span>
        Following: <span className="font-semibold">{data.following}</span>
      </span>
    </div>
  );
}
