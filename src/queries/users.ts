import { fetchUsers } from "@/actions/users";
import { UsersPage } from "@/typings/user";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

export function useFetchUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    UsersPage,
    Error,
    InfiniteData<UsersPage, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: ["users"],
    queryFn: ({ pageParam = null }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: null,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
}
