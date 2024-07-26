import prismadb from "@/lib/prismadb";
import { HeroClient } from "./components/client";
import { HeroColumn } from "./components/columns";
import { format } from "date-fns";

const HeroesPage = async ({ params }: { params: { siteId: string } }) => {
  const heroes = await prismadb.hero.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedHeroes: HeroColumn[] = heroes.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroClient data={formattedHeroes} />
      </div>
    </div>
  );
};

export default HeroesPage;
