import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import CreateProfileForm from "./CreateProfileForm";
import { getLoggedInUser } from "@/lib/server/appWrite";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Profile",
};

export default async function Page() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) return redirect("/login");

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-6 overflow-y-auto px-10 py-4 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Create Profile</h1>
          </div>
          <div className="space-y-5">
            <CreateProfileForm />
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
