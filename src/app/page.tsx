import React from 'react';
import {signIn , auth} from "@/auth"
import {redirect} from "next/navigation";

export default async function Home() {

  const session = await auth();  
  console.log("session : ", session);

  if(session && session?.user) {
    console.log("User is logged in");
    redirect(`/tasks/${session?.user?.email}`);
  }

  return (
      <>
        {session && session?.user && 
          <div className='border text-white'>
            <h1 className='text-3xl text-center'>Task Management</h1>
            
          </div>
        }
        {(!session || !session?.user) && 
          <main className='h-screen w-screen flex flex-col gap-2 justify-center items-center'>
            <form className='border border-blue-500 rounded-lg' action={async () => {
              "use server"
              await signIn("google"); //server action
            }}>
              <button className='px-4 py-2' type="submit">Sign in with Google</button>
            </form>

            <form className='border rounded-lg' action={async () => {
              "use server"
              await signIn("github"); //server action
            }}>
              <button className='px-4 py-2 border-green-500' type="submit">Sign in with Github</button>
            </form>

          </main>
        }
      </>
  );
}
