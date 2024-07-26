import prismadb from "@/lib/prismadb";
import { ThemeProvider } from "@/providers/theme-provider";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; //use this if you want to keep the landing page separated
    //redirect("/");
  }

  const site = await prismadb.site.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (site) {
    redirect(`/${site.id}`);
  }

  return <>{children}</>;
}
