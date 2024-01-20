"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import Navbar from "~/_components/Navbar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function Auth() {
  const { mutate } = api.auth.register.useMutation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegister() {
    console.log("Registering");
    setLoading(true);
    mutate(
      { email, name, password },
      {
        onSuccess: () => {
          toast.success("Registered Successfully. Please Login");
          setEmail("");
          setPassword("");
          setName("");
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          }
          const fieldErrors = error.data?.zodError?.fieldErrors;
          fieldErrors?.name?.map((e) => toast.error(e));
          fieldErrors?.email?.map((e) => toast.error(e));
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar />
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid-cols-2 grid gap-6">
            <Button variant="outline" className="flex gap-2">
              <FaGithub className="h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="flex gap-2">
              <FaGoogle className="h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-1">
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            Create account
          </Button>
          <p>
            Existing User?{" "}
            <Link href={"/api/auth/signin"}>
              <span className="cursor-pointer text-blue-500">Login</span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
