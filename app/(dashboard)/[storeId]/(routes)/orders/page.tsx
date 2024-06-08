import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { OrderColumns } from "./_components/columns";
import OrderClient from "./_components/client";

const OrdersPage = async ({params}: {params: {storeId : string}}) => {
    const ordersData = (
        await getDocs(
            collection(doc(db, 'stores', params.storeId), 'orders')
        )
    ).docs.map(doc => doc.data()) as Order[]

    const formattedOrders: OrderColumns[] = ordersData.map(item => ({
        id: item.id,
        isPaid: item.isPaid,
        phone: item.phone,
        address: item.address,
        products: item.oderItems.map(item => item.name).join(', '),
        order_status: item.order_status,
        totalPrice: item.oderItems.reduce((total, item_1) => {
            if(item && item_1.quantity !== undefined) {
                return total + Number(item_1.price * item_1.quantity)
            }
            return total

        }, 0).toString(),
        images: item.oderItems.map(item_1 => item_1.images.url[0]), 
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): ''
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders}/>
            </div>
        </div>
    );
};

export default OrdersPage
