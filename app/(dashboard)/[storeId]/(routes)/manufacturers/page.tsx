import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Manufacturer } from "@/type-db";
import { ManufacturerColumns } from "./_components/columns";
import ManufacturerClient from "./_components/client";

const ManufacturerPage = async ({params}: {params: {storeId : string}}) => {
    const manufacturerData = (
        await getDocs(
            collection(doc(db, 'stores', params.storeId), 'manufacturers')
        )
    ).docs.map(doc => doc.data()) as Manufacturer[]

    const formattedManufacturers: ManufacturerColumns[] = manufacturerData.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): ''
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ManufacturerClient data={formattedManufacturers}/>
            </div>
        </div>
    );
};

export default ManufacturerPage
