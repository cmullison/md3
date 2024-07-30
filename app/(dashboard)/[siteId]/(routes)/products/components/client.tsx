"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/api-list";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ProductColumn, columns } from "./columns";

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [isApiListOpen, setIsApiListOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 p-2">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={`Products (${data.length})`}
            description="Manage products for your store"
          />
          <Button onClick={() => router.push(`/${params.siteId}/products/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />
        <div className="flex justify-between items-center">
          <Heading title="API" description="API calls for products" />
          <Sheet open={isApiListOpen} onOpenChange={setIsApiListOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">View API</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>API List</SheetTitle>
              </SheetHeader>
              <ApiList entityName="products" entityIdName="productId" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
