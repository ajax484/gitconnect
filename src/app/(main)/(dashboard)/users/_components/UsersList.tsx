"use client";
import SearchField from "@/components/SearchField";
import { Button } from "@/components/ui/button";
import User from "@/components/users/User";
import useSearch from "@/hooks/use-search";
import { useFetchUsers } from "@/queries/users";
import { UserData } from "@/typings/user";
import { Loader2 } from "lucide-react";
import React from "react";

const UsersList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useFetchUsers();

  const users = data?.pages.flatMap((page) => page.users) || [];

  const { searchTerm, searchedData, setSearchTerm } = useSearch<UserData>({
    data: users,
    accessorKey: ["displayName", "username"],
  });

  return (
    <div className="space-y-3">
      <SearchField value={searchTerm} onInput={setSearchTerm} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous users
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !searchedData.length && (
        <p className="text-center text-muted-foreground">No users found.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading users.
        </p>
      )}
      <div className="divide-y">
        {searchedData.map((user) => (
          <User key={user.$id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersList;
