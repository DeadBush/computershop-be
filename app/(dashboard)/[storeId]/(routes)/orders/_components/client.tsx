"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { OrderColumns, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumns[]
}

const OrderClient = ({ data }: OrderClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Orders (${data.length})`}
                    description="Manage orders for your store"
                />
            </div>

            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
        </>
    )
}

export default OrderClient;
