"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { SizeColumns, columns } from "./columns";

interface SizeClientProps {
  data: SizeColumns[]
}

const SizeClient = ({ data }: SizeClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Sizes (${data.length})`}
                    description="Manage sizes for your store"
                />
                <Button onClick={()=> router.push(`/${params.storeId}/sizes/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>

            <Heading title="API" description="API calls for sizes"/>
            <Separator/>
            <ApiList entityName="sizes" entityNameId="sizeId"/>
        </>
    )
}

export default SizeClient;
