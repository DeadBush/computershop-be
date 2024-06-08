import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Manufacturer } from "@/type-db";
import { ManufacturerForm } from "./_components/manufacturer-form";

const ManufacturerPage = async ({params}: {params : {manufacturerId : string, storeId : string}}) => {
    
    const manufacturer = (
        await getDoc(doc(db, "stores", params.storeId, "manufacturers", params.manufacturerId))
    ).data() as Manufacturer; 

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ManufacturerForm initialData={manufacturer}/>
        </div>
    );
};
export default ManufacturerPage;