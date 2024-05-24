import { Footer } from "@/app/_components/Footer";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/sign-in");
  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN")
    redirect("/");
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
