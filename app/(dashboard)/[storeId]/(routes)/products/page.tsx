import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Product } from "@/type-db";
import ProductClient from "./_components/client";
import { formatter } from "@/lib/utils";
import { ProductColumns } from "./_components/columns";

const ProductsPage = async ({params}: {params: {storeId : string}}) => {
    const productsData = (
        await getDocs(
            collection(doc(db, 'stores', params.storeId), 'products')
        )
    ).docs.map(doc => doc.data()) as Product[]

    const formattedProducts: ProductColumns[] = productsData.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        category: item.category,
        size: item.size,
        manufacturer: item.manufacturer,
        brand: item.brand,
        images: item.images,
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): ''
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
};

export default ProductsPage
