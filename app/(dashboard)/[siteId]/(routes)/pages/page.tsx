import prismadb from "@/lib/prismadb";
import { PageClient } from "./components/client";
import { PageColumn } from "./components/columns";
import { format } from "date-fns";

const PagesPage = async ({ params }: { params: { siteId: string } }) => {
  const pages = await prismadb.page.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedPages: PageColumn[] = pages.map((item) => ({
    id: item.id,
    name: item.title,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PageClient data={formattedPages} />
      </div>
    </div>
  );
};

export default PagesPage;
