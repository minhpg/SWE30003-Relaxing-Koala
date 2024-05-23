"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Sign in with your OAuth account</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={() => signIn("google")}>
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
