"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Sign in with your OAuth account</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/",
            })
          }
        >
          Sign in with Google
        </Button>
        <Button className="w-full" variant={"outline"}>
          <Link href="/" className="flex items-center">
            Back to home <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
