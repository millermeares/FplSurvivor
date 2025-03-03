"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedPageProps {
  children: React.ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login"); // Redirect to login if not authenticated
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!user) return null; // Prevent content from flashing before redirect

  return <>{children}</>;
}
