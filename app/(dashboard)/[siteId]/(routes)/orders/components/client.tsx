"use client";

import { DataTable } from "@/components/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="space-y-6 p-2">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={`Orders (${data.length})`}
            description="Manage orders for your store"
          />
        </div>
        <Separator />
        <DataTable searchKey="products" columns={columns} data={data} />
      </div>
    </>
  );
};
