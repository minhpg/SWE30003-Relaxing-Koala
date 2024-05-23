import { Footer } from "@/app/_components/Footer";
import { Navbar } from "../_components/Navbar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/sign-in");
  console.log(session);
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-5 py-10">
        {children}
      </div>
      <Toaster />
      <Footer />
    </>
  );
}
