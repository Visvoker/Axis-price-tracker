import { auth } from "@/auth";
import SignInPage from "@/components/sign-in";

export default async function SignIn() {
  const session = await auth();

  return (
    <>
      <div>Email:{session?.user?.email}</div>
      <div>name:{session?.user?.name}</div>
      <SignInPage />
    </>
  );
}
