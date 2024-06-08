import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Brand } from "@/type-db";
import { BrandForm } from "./_components/brand-form";

const BrandPage = async ({params}: {params : {brandId : string, storeId : string}}) => {
    
    const brand = (
        await getDoc(doc(db, "stores", params.storeId, "brands", params.brandId))
    ).data() as Brand; 

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BrandForm initialData={brand}/>
        </div>
    );
};
export default BrandPage;