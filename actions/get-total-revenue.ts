import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore"


export const getTotalRevenue = async (StoreId: string) => {

    const ordersData = (
        await getDocs(collection(doc(db,"stores",StoreId),"orders"))
    ).docs.map((doc)=>doc.data()) as Order[];

    const paidOrders = ordersData.filter((order)=>order.isPaid)

    const totalRevenue = paidOrders.reduce((total,order)=>{
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            if(item.quantity !== undefined) {
                return orderSum + item.price *item.quantity
            }else{
                return orderSum + item.price
            }
        }, 0)
        return total + orderTotal
    }, 0)

    return totalRevenue;
};