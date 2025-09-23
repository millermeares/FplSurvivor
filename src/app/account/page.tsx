"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";
import ProtectedPage from "@/components/ProtectedPage";
import Rules from "@/components/Rules";

export default function AccountPage() {
  const { user } = useUser();
  return (
    <ProtectedPage>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Welcome {user?.name ?? "Unknown User"}</h2>
        <div className="mt-4">
          <Rules />
        </div>
        <a href="/auth/logout">
          <Button variant="destructive" className="mt-4">Log Out</Button>
        </a>
      </div>
    </ProtectedPage>
  );
}