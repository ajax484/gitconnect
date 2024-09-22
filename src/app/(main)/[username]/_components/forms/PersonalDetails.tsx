"use client";
import LoadingButton from "@/components/LoadingButton";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/mutations/users";
import { createUserProfileSchema } from "@/schemas/user";
import { createUserProfileValues } from "@/typings/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function PersonalDetailsForm() {
  const form = useForm<createUserProfileValues>({
    resolver: zodResolver(createUserProfileSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
    },
  });

  const mutation = useUpdateProfileMutation();

  async function onSubmit(values: createUserProfileValues) {
    // Create a new avatar file if cropped
    // const newAvatarFile = croppedAvatar
    //   ? new File([croppedAvatar], `avatar_${user.id}.webp`, {
    //       type: "image/webp",
    //     })
    //   : undefined;

    // if (!user?.$id) {
    //   return toast({
    //     variant: "destructive",
    //     description: "Whoops! We can't tell who you are.",
    //   });
    // }

    console.log(values, "values");

    try {
      // Trigger the mutation for updating user profile
      await mutation.mutateAsync(
        {
          ...values,
          // avatar: newAvatarFile, // Pass the cropped avatar if present
        },
        {
          onSuccess: () => {},
        }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Your display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={mutation.isPending}
            className="w-full"
          >
            Save
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
