"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { ManufacturerColumns, columns } from "./columns";

interface ManufacturerClientProps {
  data: ManufacturerColumns[]
}

const ManufacturerClient = ({ data }: ManufacturerClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Manufacturers (${data.length})`}
                    description="Manage manufacturers for your store"
                />
                <Button onClick={()=> router.push(`/${params.storeId}/manufacturers/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>

            <Heading title="API" description="API calls for manufacturers"/>
            <Separator/>
            <ApiList entityName="manufacturers" entityNameId="manufacturerId"/>
        </>
    )
}

export default ManufacturerClient;
