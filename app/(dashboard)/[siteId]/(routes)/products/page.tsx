import prismadb from "@/lib/prismadb";

import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductColumn } from "./components/columns";
import { ProductsClient } from "./components/client";

const ProductsPage = async ({ params }: { params: { siteId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      siteId: params.siteId,
    },
    include: {
      category: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    // price: item.price,
    // price: formatter.format(item.price.toNumber()),
    price: formatter.format(Number(item.price)),
    category: item.category.name,
    size: item.size.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
