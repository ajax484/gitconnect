"use server";
import { database } from "@/lib/appWrite";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appWrite";
import {
  loginSchema,
  LoginValues,
  signUpSchema,
  SignUpValues,
} from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";

export async function login(
  credentials: LoginValues
): Promise<{ error: string }> {
  try {
    const { account } = await createAdminClient();
    const { username, password } = loginSchema.parse(credentials);

    const existingUsername = await database.listDocuments("database", "users", [
      Query.equal("username", username),
    ]);

    if (existingUsername.total === 0) {
      return { error: "User does not exist" };
    }

    console.log(existingUsername.documents[0].email, "email");

    const session = await account.createEmailPasswordSession(
      existingUsername.documents[0].email,
      password
    );

    console.log(session, "secret");

    cookies().set("appSession", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { account } = await createAdminClient();
    const { email, firstName, lastName, password } =
      signUpSchema.parse(credentials);

    await account.create(
      ID.unique(),
      email,
      password,
      firstName + " " + lastName
    );

    const session = await account.createEmailPasswordSession(email, password);

    console.log(session, "secret");

    cookies().set("appSession", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return redirect("/create-profile");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function logout() {
  const cookieStore = cookies();
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  cookieStore.set("appSession", "", { expires: new Date(0) });

  return redirect("/login");
}
