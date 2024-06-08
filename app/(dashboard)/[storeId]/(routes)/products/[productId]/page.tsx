import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { Category, Product, Size, Manufacturer, Brand } from "@/type-db";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({params}: {params : {productId : string, storeId : string}}) => {
    
    const product = (
        await getDoc(doc(db, "stores", params.storeId, "products", params.productId))
    ).data() as Product; 

    const categoriesData = (
        await getDocs(collection(doc(db, 'stores', params.storeId), 'categories'))
    ).docs.map(doc => doc.data()) as Category[]

    const sizesData = (
        await getDocs(collection(doc(db, 'stores', params.storeId), 'sizes'))
    ).docs.map(doc => doc.data()) as Size[]

    const manufacturersData = (
        await getDocs(collection(doc(db, 'stores', params.storeId), 'manufacturers'))
    ).docs.map(doc => doc.data()) as Manufacturer[]

    const brandsData = (
        await getDocs(collection(doc(db, 'stores', params.storeId), 'brands'))
    ).docs.map(doc => doc.data()) as Brand[]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm 
                initialData={product}
                categories={categoriesData}
                sizes={sizesData}
                manufacturers={manufacturersData}
                brands={brandsData}
            />
        </div>
    );
};
export default ProductPage;