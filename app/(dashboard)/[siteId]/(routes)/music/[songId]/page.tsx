import prismadb from "@/lib/prismadb";
import { SongForm } from "./components/song-form";

const SongPage = async ({
  params,
}: {
  params: { songId: string; siteId: string };
}) => {
  const size = await prismadb.music.findUnique({
    where: {
      id: params.songId,
      // id: params.siteId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SongForm initialData={size} />
      </div>
    </div>
  );
};

export default SongPage;
