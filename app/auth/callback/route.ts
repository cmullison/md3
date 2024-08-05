import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    try {
      const { tokens } = await client.getToken({
        code,
        redirect_uri: `${origin}/auth/callback`,
      });

      if (!tokens.id_token) {
        throw new Error('ID token is missing');
      }

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (payload && payload.email) {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.signUp({
          email: payload.email,
          password: tokens.access_token || '', // Use access token as password, fallback to empty string if undefined
        });

        if (error) {
          console.error('Error creating user in Supabase:', error);
          return redirect('/auth/error');
        }

        if (user) {
          const firstName = payload.given_name || '';
          const lastName = payload.family_name || '';

          try {
            const existingProfile = await prisma.profile.findFirst({
              where: { userId: user.id },
            });

            if (!existingProfile) {
              await prisma.profile.create({
                data: {
                  userId: user.id,
                  first_name: firstName,
                  last_name: lastName,
                  email: payload.email,
                },
              });
            } else {
              await prisma.profile.update({
                where: { id: existingProfile.id },
                data: {
                  first_name: firstName,
                  last_name: lastName,
                  email: payload.email,
                },
              });
            }
          } catch (error) {
            console.error('Error updating profile:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      return redirect('/auth/error');
    }
  }

  return redirect(`/`);
}