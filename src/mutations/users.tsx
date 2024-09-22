import { createUserProfile, updateEducationProfile, updateExperienceProfile, updateUserProfile } from "@/actions/users";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/typings/posts";
import {
  createUserProfileValues,
  EducationValues,
  jobExperienceValues,
  UpdateUserProfileValues,
} from "@/typings/user";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  //   const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (values: createUserProfileValues) => {
      console.log(values, "values");

      // Ensure you're passing values and expecting a serializable object
      return await createUserProfile(values);
    },
    onSuccess: async (updatedUser) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.$id === updatedUser?.$id) {
                  return {
                    ...post,
                    user: {
                      ...post.user, // Spread original user data
                      displayName: updatedUser.displayName, // Updated user info
                      avatarUrl: updatedUser.avatarUrl, // Plain string or null
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.push("/");

      toast({
        description: "Profile created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          error.message ?? "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}

export function useUpdateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  //   const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (values: UpdateUserProfileValues) => {
      console.log(values, "values");

      // Ensure you're passing values and expecting a serializable object
      return await updateUserProfile(values);
    },
    onSuccess: async (updatedUser) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.$id === updatedUser?.$id) {
                  return {
                    ...post,
                    user: {
                      ...post.user, // Spread original user data
                      displayName: updatedUser.displayName, // Updated user info
                      avatarUrl: updatedUser.avatarUrl, // Plain string or null
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({
        description: "Profile updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}

export function useUpdateEducationMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  //   const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (values: EducationValues) => {
      console.log(values, "values");

      // Ensure you're passing values and expecting a serializable object
      return await updateEducationProfile(values);
    },
    onSuccess: async (updatedUser) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.$id === updatedUser?.$id) {
                  return {
                    ...post,
                    user: {
                      ...post.user, // Spread original user data
                      displayName: updatedUser.displayName, // Updated user info
                      avatarUrl: updatedUser.avatarUrl, // Plain string or null
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({
        description: "education updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update education. Please try again.",
      });
    },
  });

  return mutation;
}

export function useUpdateExperienceMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  //   const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (values: jobExperienceValues) => {
      console.log(values, "values");

      // Ensure you're passing values and expecting a serializable object
      return await updateExperienceProfile(values);
    },
    onSuccess: async (updatedUser) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.$id === updatedUser?.$id) {
                  return {
                    ...post,
                    user: {
                      ...post.user, // Spread original user data
                      displayName: updatedUser.displayName, // Updated user info
                      avatarUrl: updatedUser.avatarUrl, // Plain string or null
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({
        description: "education updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update education. Please try again.",
      });
    },
  });

  return mutation;
}
