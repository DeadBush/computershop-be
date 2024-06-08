"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { ProductColumns, columns } from "./columns";

interface ProductClientProps {
  data: ProductColumns[]
}

const ProductClient = ({ data }: ProductClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Products (${data.length})`}
                    description="Manage products for your store"
                />
                <Button onClick={()=> router.push(`/${params.storeId}/products/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>

            <Heading title="API" description="API calls for products"/>
            <Separator/>
            <ApiList entityName="products" entityNameId="productId"/>
        </>
    )
}

export default ProductClient;
