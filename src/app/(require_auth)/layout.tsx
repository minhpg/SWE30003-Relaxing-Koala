import { ReactNode } from "react";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
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
