import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function Page({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return <LoginForm callbackUrl={callbackUrl ?? "/select-group"} />;
}
