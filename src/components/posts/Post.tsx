"use client";
import { formatRelativeDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import { PostData } from "@/typings/posts";
import { useUser } from "@/providers/UserProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import LikeButton from "./LikeButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useUser();

  if (!user) return null;

  console.log(post, "post");

  return (
    <article className="rounded-2xl bg-card p-5 shadow-sm">
      <Link
        className="space-y-3"
        href={`/${post.user.username}/posts/${post.$id}`}
      >
        <div className="flex justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <UserTooltip user={post.user}>
              <Link href={`/${post.user.username}`}>
                <UserAvatar avatarUrl={post.user.avatarUrl} />
              </Link>
            </UserTooltip>
            <div>
              <div className="flex items-center gap-4 ">
                <UserTooltip user={post.user}>
                  <span className="block font-medium">
                    {post.user.displayName}
                  </span>
                </UserTooltip>
                <span className="text-muted-foreground text-sm">
                  {formatRelativeDate(new Date(post.$createdAt))}
                </span>
              </div>
              <Link
                className="text-sm hover:underline text-muted-foreground"
                href={`/${post.user.username}`}
              >
                @{post.user.username}
              </Link>
            </div>
          </div>
          {post.user.$id === user.$id && (
            <PostMoreButton post={post} className="" />
          )}
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">{post.content}</div>
        </Linkify>
        <hr className="text-muted-foreground" />
        <div className="flex justify-between gap-5">
          <div className="flex items-center gap-5">
            <LikeButton postId={post.$id} likes={post.likes} />
            <CommentButton post={post} onClick={() => {}} />
          </div>
        </div>
        {/* {showComments && <Comments post={post} />} */}
      </Link>
    </article>
  );
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post.comments} <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
