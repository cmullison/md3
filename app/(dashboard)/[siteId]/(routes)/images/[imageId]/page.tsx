import prismadb from "@/lib/prismadb";
import { ImageForm } from "./components/image-form";

const ImagePage = async ({
  params,
}: {
  params: { imageId: string; siteId: string };
}) => {
  const image = await prismadb.image.findUnique({
    where: {
      id: params.imageId,
      // id: params.siteId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ImageForm initialData={image} />
      </div>
    </div>
  );
};

export default ImagePage;
