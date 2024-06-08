import { db, storage } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";
import { z } from "zod";

const storeSchema = z.object({
  name: z.string().min(3, "Store name is required 3 letter"),
});

export const PATCH= async(req: Request, 
    {params}:{params: {storeId : string}})=> {
    
    try {       
        const {userId}= auth();
        const body=await req.json()

        if(!userId) {
            return new NextResponse("Un-Authorized", {status : 400})
        }

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", {status : 400})
        }
    
        const {name} =body;
            
        if(!name) {
            return new NextResponse("Store Name is missing!", {status:400})
        }

        const docRef= doc(db,"stores", params.storeId);
        await updateDoc(docRef, {name});
        const store= (await getDoc(docRef)).data() as Store
    
        return NextResponse.json({ store });

    } catch (error) {
        console.log('STORE_PATCH: ${error}')
        return new NextResponse("Internal Server Error", {status : 500})
    }
};

export const DELETE= async(req: Request, 
    {params}:{params: {storeId : string}})=> {
    
    try {       
        const {userId}= auth();

        if(!userId) {
            return new NextResponse("Un-Authorized", {status : 400})
        }

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", {status : 400})
        }

        const docRef= doc(db,"stores", params.storeId);

        // delete billboard
        const billboardsQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/billboards`)
        )

        billboardsQuerySnapshot.forEach(async (billboardDoc) => {
            await deleteDoc(billboardDoc.ref)

            const imageUrl = billboardDoc.data().imageUrl
            if(imageUrl) {
                const imageRef = ref(storage, imageUrl)
                await deleteObject(imageRef)
            }
        })

        // delete categories
        const categoriesQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/categories`)
        )

        categoriesQuerySnapshot.forEach(async (categoryDoc) => {
            await deleteDoc(categoryDoc.ref)
        })

        // delete sizes
        const sizesQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/sizes`)
        )

        sizesQuerySnapshot.forEach(async (sizeDoc) => {
            await deleteDoc(sizeDoc.ref)
        })

        // delete manufacturers
        const manufacturersQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/manufacturers`)
        )

        manufacturersQuerySnapshot.forEach(async (manufacturerDoc) => {
            await deleteDoc(manufacturerDoc.ref)
        })

        // delete brands
        const brandsQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/brands`)
        )

        brandsQuerySnapshot.forEach(async (brandDoc) => {
            await deleteDoc(brandDoc.ref)
        })

        // delete products
        const productsQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/products`)
        )

        productsQuerySnapshot.forEach(async (productDoc) => {
            await deleteDoc(productDoc.ref)

            const imagesArray = productDoc.data().images
            if(imagesArray && Array.isArray(imagesArray)) {
                await Promise.all(
                    imagesArray.map(async (image) => {
                        const imageRef = ref(storage, image.url)
                        await deleteObject(imageRef)
                    })
                )
            }
        })

        // delete orders
        const ordersQuerySnapshot = await getDocs(
            collection(db, `stores/${params.storeId}/orders`)
        )

        ordersQuerySnapshot.forEach(async (orderDoc) => {
            await deleteDoc(orderDoc.ref)

            const ordersItemArray = orderDoc.data().orderItems

            if(ordersItemArray && Array.isArray(ordersItemArray)) {
                await Promise.all(
                    ordersItemArray.map(async (orderItem) => {
                        const itemIamgesArray = orderItem.images

                        if(itemIamgesArray && Array.isArray(itemIamgesArray)) {
                            await Promise.all(
                                itemIamgesArray.map(async (image) => {
                                    const imageRef = ref(storage, image.url)
                                    await deleteObject(imageRef)
                                })
                            )
                        }
                    })
                )
            }
        })

        // finally delete store
        await deleteDoc(docRef);

        return NextResponse.json({
            msg: "Store and all of its sub-collections deleted"
        })

    } catch (error) {
        console.log('STORE_PATCH: ${error}')
        return new NextResponse("Internal Server Error", {status : 500})
    }
};