"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { CategoryColumns, columns } from "./columns";

interface CategoryClientProps {
  data: CategoryColumns[]
}

const CategoryClient = ({data}: CategoryClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${data.length})`}
                    description="Manage categories for your store"
                />
                <Button onClick={()=> router.push(`/${params.storeId}/categories/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator/>
            <DataTable searchKey="category" columns={columns} data={data}/>

            <Heading title="API" description="API calls for categories"/>
            <Separator/>
            <ApiList entityName="categories" entityNameId="categoryId"/>
        </>
    )
}

export default CategoryClient;
