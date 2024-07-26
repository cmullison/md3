import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";
import axios from "axios";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

export default function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
      return redirect("/login?message=Could not authenticate user");
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const profile = await prismadb.profile.create({
      data: {
        first_name,
        last_name,
        email,
        userId: user.id,
      },
    });

    const send = await prismadb.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!send) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data } = await resend.emails.send({
      from: "Chris <onboarding@liontreesgolf.com>",
      to: send.email,
      subject: "Welcome to Liontrees Golf!",
      react: EmailTemplate({
        firstName: send.first_name,
        lastName: send.last_name,
        createdAt: send.createdAt,
      }) as React.ReactElement,
    });
    console.log(data);
    if (error) {
      console.log(error);
    }

    return redirect("/");
  };
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="first_name">
          First name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="first_name"
          placeholder=""
          required
        />
        <label className="text-md" htmlFor="last_name">
          Last name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="last_name"
          placeholder=""
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <SubmitButton
          formAction={signUp}
          className="bg-secondary rounded-md px-4 py-2 text-primary mb-2"
          pendingText="Signing Up..."
          disabled
        >
          Sign Up
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
