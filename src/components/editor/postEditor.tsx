"use client";

import LoadingButton from "@/components/LoadingButton";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import "./styles.css";
import { useUser } from "@/providers/UserProvider";
import { useSubmitPostMutation } from "@/mutations/posts";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function PostEditor() {
  const { user } = useUser();

  const [content, setContent] = useState<string>("");

  const mutation = useSubmitPostMutation();

  if (!user) return null;

  function onSubmit() {
    if (!user?.$id)
      return toast({
        variant: "destructive",
        description: "Whoops! We can't tell who you are.",
      });

    mutation.mutateAsync(
      {
        content,
        userId: user?.$id,
      },
      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          avatar={user?.avatar || ""}
          className="hidden sm:inline"
        />
        <div className="w-full">
          <Textarea
            value={content}
            onInput={(e) => setContent(e.currentTarget.value)}
            placeholder="Type your message here."
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3 resize-none"
            )}
            rows={2}
            maxLength={280}
          />
        </div>

        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!content.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
