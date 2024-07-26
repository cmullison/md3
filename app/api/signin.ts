import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: 'Could not authenticate user' });
  }

  const { user } = data;
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const profile = await prismadb.profile.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      first_name: true,
      last_name: true,
    },
  });

  if (profile) {
    return res.status(200).json({ first_name: profile.first_name, last_name: profile.last_name });
  }

  return res.status(404).json({ message: 'Profile not found' });
}