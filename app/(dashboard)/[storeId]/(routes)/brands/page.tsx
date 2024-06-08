import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Brand } from "@/type-db";
import { BrandColumns } from "./_components/columns";
import BrandClient from "./_components/client";

const BrandPage = async ({params}: {params: {storeId : string}}) => {
    const brandsData = (
        await getDocs(
            collection(doc(db, 'stores', params.storeId), 'brands')
        )
    ).docs.map(doc => doc.data()) as Brand[]

    const formattedBrands: BrandColumns[] = brandsData.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): ''
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BrandClient data={formattedBrands}/>
            </div>
        </div>
    );
};

export default BrandPage
