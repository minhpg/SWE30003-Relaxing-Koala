import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Footer } from "../_components/Footer";
import { Navbar } from "../_components/Navbar";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/sign-in");
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-5 py-10">
        {children}
      </div>
      <Footer />
    </>
  );
}
