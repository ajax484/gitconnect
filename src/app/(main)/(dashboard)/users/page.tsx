import { Metadata } from "next";
import UsersList from "./_components/UsersList";

export const metadata: Metadata = {
  title: "Users",
};

export default function page() {
  return (
    <main className="space-y-5 w-full">
      <div className="rounded-2xl bg-card p-5 shadow-sm w-full">
        <h2 className="text-center text-2xl font-bold">Users</h2>
      </div>
      <UsersList />
    </main>
  );
}
