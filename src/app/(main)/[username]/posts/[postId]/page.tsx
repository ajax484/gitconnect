import { fetchPostById } from "@/actions/posts";
import Comments from "@/components/posts/comments/Comments";
import Post from "@/components/posts/Post";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: { postId: string };
}

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  let post;
  try {
    post = await fetchPostById(postId);

    if (!post) {
      return { title: "post not found" };
    }
    return {
      title: `${post.user.displayName} posted: "${post.content}"`,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { title: "post not found" };
  }
}

export default async function Page({ params: { postId } }: PageProps) {
  let post;

  try {
    post = await fetchPostById(postId);

    if (!post) {
      return redirect("/");
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return redirect("/");
  }

  return (
    <section className="w-full space-y-4">
      <section className="w-full">
        <Post post={post} />
      </section>
      <section className="w-full">
        <Comments post={post} />
      </section>
    </section>
  );
}
