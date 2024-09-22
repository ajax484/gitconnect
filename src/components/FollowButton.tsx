"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { FollowerInfo } from "@/typings/followers";
import { followUser, unfollowUser } from "@/actions/followers";
import useFollowerInfo from "@/hooks/useFollowerInfo";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutateAsync } = useMutation({
    mutationFn: async () =>
      data.isFollowingUser
        ? await unfollowUser(userId)
        : await followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      if (!previousState) return previousState;

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        ...previousState,
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowingUser ? -1 : 1),
        isFollowingUser: !previousState?.isFollowingUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowingUser ? "secondary" : "default"}
      onClick={() => mutateAsync()}
    >
      {data.isFollowingUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
