import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Castaway Picks",
  description: "Pick your favorite castaways and compete with friends!",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto">
        <div className="flex-grow w-full px-4 py-6 pb-20">{children}</div>
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t">
          <Navbar />
        </div>
      </body>
    </html>
  );
}
