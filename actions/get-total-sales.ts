import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalSales = async (storeId:string)=>{
    const ordersData = await getDocs(
        collection(doc(db,"store",storeId),"orders")
    );

    const count = ordersData.size;

    return count;
}