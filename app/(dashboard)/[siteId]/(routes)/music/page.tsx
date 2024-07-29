import prismadb from "@/lib/prismadb";
import { SongsClient } from "./components/client";
import { SongColumn } from "./components/columns";
import { format } from "date-fns";

const SongsPage = async ({ params }: { params: { siteId: string } }) => {
  const songs = await prismadb.music.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSongs: SongColumn[] = songs.map((item) => ({
    id: item.id,
    name: item.title,
    value: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SongsClient data={formattedSongs} />
      </div>
    </div>
  );
};

export default SongsPage;
