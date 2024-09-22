import { togglePostLike } from "@/actions/posts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@/providers/UserProvider";
import { PostsPage } from "@/typings/posts";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  likes: string[];
}

export default function LikeButton({ postId, likes }: LikeButtonProps) {
  const { user } = useUser();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: togglePostLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post-feed"] });

      const previousData = queryClient.getQueriesData<
        InfiniteData<PostsPage>[]
      >({
        queryKey: ["post-feed"],
      });

      console.log(previousData, "previous data");

      queryClient.setQueriesData<InfiniteData<PostsPage>>(
        {
          queryKey: ["post-feed"],
        },
        (oldData) => {
          if (!oldData || !user) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) => {
                if (p.$id === postId) {
                  const userAlreadyLiked = p.likes?.includes(user.$id);

                  return {
                    ...p,
                    likes: userAlreadyLiked
                      ? p.likes.filter((userId) => userId !== user.$id)
                      : [...(p.likes || []), user.$id],
                    isLikedByUser: !userAlreadyLiked,
                  };
                }
                return p;
              }),
            })),
          };
        }
      );

      //   return { previousData };
    },
    onError: (error) => {
      queryClient.setQueriesData(
        { queryKey: ["post-feed"] },
        (oldData) => oldData
      );
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<PostsPage>>(
        ["post-feed"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) => {
                if (p.$id === postId) {
                  return {
                    ...p,
                    likes: data.likes, // Update with the new like count from the server
                    isLikedByUser: data.isLikedByUser, // Ensure the like status is up to date
                  };
                }
                return p;
              }),
            })),
          };
        }
      );
    },
  });

  if (!user) return null;
  const isLikedByUser = likes.includes(user.$id);

  return (
    <button
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutateAsync(postId);
      }}
      className="flex items-center gap-2"
    >
      <Heart
        className={cn("size-5", isLikedByUser && "fill-red-500 text-red-500")}
      />
      <span className="text-sm font-medium tabular-nums">
        {likes.length} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
