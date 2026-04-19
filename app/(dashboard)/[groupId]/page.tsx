import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Guild Price Tracker</h1>
          <p className="mt-2 text-sm text-muted-foreground">目前尚未登入</p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-md border px-4 py-2 text-sm font-medium"
          >
            前往登入
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Guild Price Tracker</h1>
        <p className="mt-2 text-sm text-muted-foreground">已成功登入</p>

        <div className="mt-6 space-y-2 text-sm">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {session.user.name ?? "No name"}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {session.user.email ?? "No email"}
          </p>
          <p>
            <span className="font-medium">User Image:</span>{" "}
            {session.user.image ?? "No image"}
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            登出
          </button>
        </form>
      </div>
    </main>
  );
}
