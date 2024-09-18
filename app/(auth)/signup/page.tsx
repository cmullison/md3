"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { useEffect, useRef, useState } from "react";
import { signUp } from "@/app/actions";

interface SignUpPageProps {
  searchParams?: { message?: string };
}

const SignUpPage: React.FC<SignUpPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const firstDivRef = useRef<HTMLDivElement>(null);

  const handleSignUp = async (formData: FormData) => {
    try {
      const result = await signUp(formData);
      if (result.ok) {
        router.push("/redirect");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during sign up. Please try again.");
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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={handleSignUp}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="first_name" className="sr-only">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="sr-only">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last name"
              />
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <SubmitButton
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
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

export default SignUpPage;
