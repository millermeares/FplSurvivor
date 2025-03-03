"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/castaways");
    }
  }, [user, router]);

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
