import { Client, Account, Databases } from "appwrite";

console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT, process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
export const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");

export const account = new Account(client);

export const database = new Databases(client);
export { ID } from "appwrite";
