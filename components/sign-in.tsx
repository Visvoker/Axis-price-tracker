"use client";

import { signIn, signOut } from "next-auth/react";

export default function SignInPage() {
  return (
    <>
      <button className=" cursor-pointer" onClick={() => signIn("google")}>
        SignIn
      </button>
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/test",
          })
        }
      >
        Sign out
      </button>
    </>
  );
}
