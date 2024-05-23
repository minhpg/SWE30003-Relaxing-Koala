"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";
import { routes } from "./routes";
import { UserNav } from "./UserNav";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Relaxing Koala</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname == route.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <MainNav />
        <MobileNav />
        <UserNav />
      </div>
    </header>
  );
}
