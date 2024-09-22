import { getUserFollowers } from "@/actions/followers";
import { FollowerInfo } from "@/typings/followers";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => await getUserFollowers(userId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
