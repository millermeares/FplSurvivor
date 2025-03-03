"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname(); // Highlight active button

  if (!user) return null; // Hide navbar if not logged in

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-around p-3">
        <NavButton href="/castaways" icon="🏝️" label="Castaways" active={pathname === "/castaways"} />
        <NavButton href="/standings" icon="📊" label="Standings" active={pathname === "/standings"} />
        <NavButton href="/stats" icon="📈" label="Stats" active={pathname === "/stats"} />
        <NavButton href="/account" icon="⚙️" label="Account" active={pathname === "/account"} />
      </div>
    </nav>
  );
}

function NavButton({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn("flex flex-col items-center text-gray-500", active && "text-black font-bold")}>
      <span>{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
