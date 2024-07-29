import prismadb from "@/lib/prismadb";
import { ImageClient } from "./components/client";
import { ImageColumn } from "./components/columns";
import { format } from "date-fns";

const ImagesPage = async ({ params }: { params: { siteId: string } }) => {
  const images = await prismadb.image.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedImages: ImageColumn[] = images.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ImageClient data={formattedImages} />
      </div>
    </div>
  );
};

export default ImagesPage;
