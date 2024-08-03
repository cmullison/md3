// app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, password } = await req.json();

    const supabase = createClient();

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: "Could not create user" }, { status: 400 });
    }

    const user = data.user;

    if (!user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 400 });
    }

    const profile = await prismadb.profile.create({
      data: {
        first_name,
        last_name,
        email,
        userId: user.id,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Chris <onboarding@liontreesgolf.com>",
      to: email,
      subject: "Welcome to Liontrees Golf!",
      react: EmailTemplate({
        firstName: first_name,
        lastName: last_name,
        createdAt: profile.createdAt,
      }) as React.ReactElement,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 });
  }
}