import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return redirect('/auth/error');
    }

    if (data.user) {
      const { user } = data;
      
      // Extract first and last name from user metadata
      const firstName = user.user_metadata?.full_name?.split(' ')[0] || '';
      const lastName = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';

      try {
        // Check if profile already exists
        const existingProfile = await prisma.profile.findFirst({
          where: { userId: user.id },
        });

        if (!existingProfile) {
          // Create new profile
          await prisma.profile.create({
            data: {
              userId: user.id,
              first_name: firstName,
              last_name: lastName,
              email: user.email || '', // Provide a default empty string if email is undefined
            },
          });
        } else {
          // Update existing profile
          await prisma.profile.update({
            where: { id: existingProfile.id }, // Use the id field instead of userId
            data: {
              first_name: firstName,
              last_name: lastName,
              email: user.email || '', // Provide a default empty string if email is undefined
            },
          });
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

  // URL to redirect to after sign up process completes
  return redirect(`/redirect`);
}