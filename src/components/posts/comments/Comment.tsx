"use client";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { formatRelativeDate } from "@/lib/utils";
import { useUser } from "@/providers/UserProvider";
import { CommentData } from "@/typings/posts";
import Link from "next/link";
import CommentMoreButton from "./CommentMore";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div className="flex-[1]">
        <div className="flex items-center gap-4 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(new Date(comment.$createdAt))}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.$id === user.$id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto"
        />
      )}
    </div>
  );
}
