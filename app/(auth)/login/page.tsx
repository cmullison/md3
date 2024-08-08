"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { signIn } from "@/app/actions";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui

interface SignInPageProps {
  searchParams?: { message?: string };
}

interface SignInResult {
  error?: string;
}

const SignInPage: React.FC<SignInPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const firstDivRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const handleSignIn = async (formData: FormData) => {
    const result = (await signIn(formData)) as SignInResult | undefined;
    if (result?.error) {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  useEffect(() => {
    if (firstDivRef.current) {
      setTimeout(() => {
        firstDivRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div ref={firstDivRef} tabIndex={-1}>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn(new FormData(e.currentTarget));
          }}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <SubmitButton
              formAction={handleSignIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              pendingText="Signing in..."
            >
              Sign in
            </SubmitButton>
          </div>
        </form>

        <div>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
        <div className="text-center text-sm">
          <Link
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
        {(error || searchParams?.message) && (
          <p className="mt-4 p-4 bg-red-100 text-red-700 text-center rounded-lg">
            {error || searchParams?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
