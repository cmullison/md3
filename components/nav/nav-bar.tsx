import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SiteSwitcher from "@/components/nav/site-switcher";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import prismadb from "@/lib/prismadb";
import { Site } from "@prisma/client";

async function getSitesForUser(userId: string): Promise<Site[]> {
  try {
    return await prismadb.site.findMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Failed to fetch sites:", error);
    return [];
  }
}

const Navbar = async () => {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    const sites = await getSitesForUser(user.id);

    return (
      <nav className="border-b px-4 mx-auto sticky top-0 z-10 bg-background">
        <div className="flex h-16 w-full justify-start items-center">
          <SiteSwitcher items={sites} />
          <MainNav />
        </div>
      </nav>
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

export default Navbar;
