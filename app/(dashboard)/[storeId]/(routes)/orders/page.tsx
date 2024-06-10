import { collection, doc, getDocs } from "firebase/firestore";
import { format } from 'date-fns'

import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { OrderColumns } from "./_components/columns";
import OrderClient from "./_components/client";
import { formatter } from "@/lib/utils";

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
        products: item.orderItems.map(item => item.name).join(', '),
        order_status: item.order_status,
        totalPrice: formatter.format(
            item.orderItems.reduce((total, item) => {
            if(item && item.quantity !== undefined) {
                return total + Number(item.price * item.quantity)
            }
            return total

        }, 0)
    ),
        images: item.orderItems.map((item) => item.images.url[0]), 
        createAt: item.createAt ? format(item.createAt.toDate(), 'MMMM do, yyyy'): '',
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders}/>
            </div>
        </div>
    );
};

export default OrdersPage
