import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; siteId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
      // id: params.siteId,
    },
    include: {
      productImages: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      siteId: params.siteId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
