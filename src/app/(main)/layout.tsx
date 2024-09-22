"use server";

import { fetchUser } from "@/actions/users";
import MainLayout from "./MainLayout";
import { getLoggedInUser } from "@/lib/server/appWrite";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) return redirect("/login");

  const user = await fetchUser(loggedInUser?.$id);

  return <MainLayout user={user}>{children}</MainLayout>;
}
