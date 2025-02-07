import React from "react";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default async function Home() {
  const session = await auth();

  // Redirecting user to tasks if logged in
  if (session && session?.user) {
    const user = session.user;
    console.log("User is logged in");
    redirect(`/tasks/${user.email}`);
  }

  return (
    <>
      <h1 className="absolute text-4xl md:text-5xl font-extrabold text-center my-8 bg-gradient-to-r from-blue-400 w-full to-indigo-600 text-transparent bg-clip-text drop-shadow-lg">
        Task Management
      </h1>
      <main className="h-screen w-screen flex flex-col gap-4 justify-center items-center">
        
        {/* Google OAuth */}
        <form
          className="border border-blue-500 rounded-lg"
          action={async () => {
            "use server";
            await signIn("google"); //server action
          }}
        >
          <button className="flex gap-2 px-4 py-2" type="submit">
            <FcGoogle size={24} />
            <span className="">Sign in with Google</span>
          </button>
        </form>

        {/* Github OAuth */}
        <form
          className="border rounded-lg"
          action={async () => {
            "use server";
            await signIn("github"); //server action
          }}
        >
          <button className="flex gap-2 px-4 py-2" type="submit">
            <FaGithub size={24} />
            <span className="">Sign in with Github</span>
          </button>
        </form>
        
      </main>
    </>
  );
}
