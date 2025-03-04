"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";
import ProtectedPage from "@/components/ProtectedPage";

export default function AccountPage() {
  const { user } = useUser();
  console.log(user)
  return (
    <ProtectedPage>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{user?.name ?? "Unknown User"}</h2>
        <p className="text-sm text-gray-500">Scoring Rules: TBD</p>
        <a href="/auth/logout">
          <Button variant="destructive" className="mt-4">Log Out</Button>
        </a>
      </div>
    </ProtectedPage>
  );
}
