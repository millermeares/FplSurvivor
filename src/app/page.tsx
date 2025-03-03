import { auth0 } from "@/lib/auth0";
import CastawaySelection from "@/components/CastawaySelection";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Fantasy Survivor</h1>
        <p className="text-gray-500">Log in to start selecting your castaways!</p>
        <a href="/auth/login?screen_hint=signup">
          <Button>Sign Up</Button>
        </a>
        <a href="/auth/login">
          <Button variant="outline">Log In</Button>
        </a>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-xl font-bold">Welcome, {session.user.name}!</h1>
      <CastawaySelection />
      <a href="/auth/logout">
        <Button variant="destructive">Log Out</Button>
      </a>
    </main>
  );
}
