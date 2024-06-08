"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"

export type ProductColumns = {
    id: string,
    name: string,
    price: number,
    isFeatured: boolean,
    isArchived: boolean,
    category: string,
    size: string,
    manufacturer: string,
    brand: string,
    images: { url: string[] },
    createAt: string;
}

export const columns: ColumnDef<ProductColumns>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: "Price"
    },
    {
        accessorKey: "isFeatured",
        header: "Featured"
    },
    {
        accessorKey: "isArchived",
        header: "Archived"
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "size",
        header: "Size"
    },
    {
        accessorKey: "manufacturer",
        header: "Manufacturer"
    },
    {
        accessorKey: "brand",
        header: "Brand"
    },
    {
        accessorKey: "createAt",
        header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
        },
    },

    {
        id: 'actions',
        cell: ({row}) => <CellAction data={row.original}/>
    }
]
