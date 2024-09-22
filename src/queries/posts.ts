import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { fetchPostComments, fetchPosts, fetchUserPosts } from "@/actions/posts";
import { CommentsPage, PostsPage } from "@/typings/posts";

export function usePostFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    PostsPage,
    Error,
    InfiniteData<PostsPage, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam = null }) => fetchPosts(pageParam),
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

export function useUserPosts(userId: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    PostsPage,
    Error,
    InfiniteData<PostsPage, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam = null }) => fetchUserPosts(userId, pageParam),
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

export function usePostComments(postId: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    CommentsPage,
    Error,
    InfiniteData<CommentsPage, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: ["post-comments", postId],
    queryFn: ({ pageParam = null }) => fetchPostComments(postId, pageParam),
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
