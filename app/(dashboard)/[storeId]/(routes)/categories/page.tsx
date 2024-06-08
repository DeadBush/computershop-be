import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Category } from "@/type-db";
import CategoryClient from "./_components/client";
import { CategoryColumns } from "./_components/columns";

const CategoriesPage = async ({params}: {params: {storeId : string}}) => {
    const categoriesData = (
        await getDocs(
            collection(doc(db, 'stores', params.storeId), 'categories')
        )
    ).docs.map(doc => doc.data()) as Category[]

    const formattedCategories: CategoryColumns[] = categoriesData.map(item => ({
        id: item.id,
        billboardLabel: item.billboardLabel,
        name: item.name,
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): ''
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
    );
};

export default CategoriesPage;
