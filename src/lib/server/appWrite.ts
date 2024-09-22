// src/lib/server/appwrite.ts
"use server";

import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { Models } from "node-appwrite";

// Define the return types for the session and admin clients
interface AppwriteSessionClient {
  account: Account;
}

interface AppwriteAdminClient {
  account: Account;
}

// Create a session client with proper type safety
export async function createSessionClient(): Promise<AppwriteSessionClient> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

  const session = cookies().get("appSession");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// Create an admin client with proper type safety
export async function createAdminClient(): Promise<AppwriteAdminClient> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_KEY as string);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Create an admin client with proper type safety
export async function createDatabaseClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_KEY as string);

  return {
    get database() {
      return new Databases(client);
    },
  };
}
