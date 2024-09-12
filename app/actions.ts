"use server";

import { EmailTemplate } from "@/components/email-template";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    } return redirect("/redirect");
};
  
export const signUp = async (formData: FormData) => {
  const origin = headers().get("origin");
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();
  
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return redirect("/login?message=Could not authenticate user");
  }

  if (!data.user) {
    return new NextResponse("User not created", { status: 400 });
  }

  try {
    const profile = await prismadb.profile.create({
      data: {
        first_name,
        last_name,
        email,
        userId: data.user.id,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Chris <onboarding@liontreesgolf.com>",
      to: profile.email,
      subject: "Welcome to Liontrees Golf!",
      react: EmailTemplate({
        firstName: profile.first_name,
        lastName: profile.last_name,
        createdAt: profile.createdAt,
      }) as React.ReactElement,
    });

    if (emailError) {
      console.error(emailError);
    } else {
    }

    return redirect("/");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const updateTitle = async (id: string, newTitle: string) => {
  if (!newTitle || newTitle.trim().length === 0) {
    return { success: false, message: "Title cannot be empty" };
  }

  try {
    const updatedTitle = await prismadb.conversation.update({
      where: { id },
      data: { title: newTitle.trim() },
    });

    if (!updatedTitle) {
      return { success: false, message: "Conversation not found" };
    }

    return { success: true, item: updatedTitle };
  } catch (error) {
    console.error("Error updating title:", error);
    return { success: false, message: "Failed to update title. Please try again." };
  }
};