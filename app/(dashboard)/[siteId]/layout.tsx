import Navbar from "@/components/nav/nav-bar";
import prismadb from "@/lib/prismadb";
import { ProfileProvider } from "@/providers/profile-provider";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation"; // Adjust the import path accordingly

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const site = await prismadb.site.findFirst({
    where: {
      id: params.siteId,
      userId: user.id,
    },
  });

  if (!site) {
    return redirect("/");
  }

  const profile = await prismadb.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!profile) {
    return redirect("/");
  }

  return (
    <ProfileProvider profile={profile}>
      <Navbar />
      {children}
    </ProfileProvider>
  );
}
