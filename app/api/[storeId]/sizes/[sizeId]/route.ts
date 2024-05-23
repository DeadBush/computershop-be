import { db } from "@/lib/firebase"
import { Billboards, Category, Size } from "@/type-db"
import { auth } from "@clerk/nextjs/server"
import { 
    deleteDoc, 
    doc, 
    getDoc, 
    serverTimestamp, 
    updateDoc 
} from "firebase/firestore"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, 
    {params} : {params : {storeId: string, sizeId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { name, value } = body

            if(!name) {
                return new NextResponse('Size name is missing!', { status: 400 })
            }

            if(!value) {
                return new NextResponse('Size value is missing!', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const sizeRef = await getDoc(
                doc(db, 'stores', params.storeId, 'sizes', params.sizeId)
            )

            if(sizeRef.exists()) {
                await updateDoc(
                    doc(db, 'stores', params.storeId, 'sizes', params.sizeId),
                    {
                        ...sizeRef.data,
                        name,
                        value,
                        updateAt: serverTimestamp(),
                    }
                )
            } else {
                return new NextResponse('Size not found', {status: 404})
            }

            const size = (
                await getDoc(
                    doc(db, 'stores', params.storeId, 'sizes', params.sizeId)
                )
            ).data() as Size

            return NextResponse.json(size)

        } catch (err) {
            console.log(`SIZE_PATCH: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const DELETE = async (req: Request, 
    {params} : {params : {storeId: string, sizeId: string}}) => {
        try {
            const { userId } = auth()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            if(!params.sizeId) {
                return new NextResponse('Size id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const sizeRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId)

            await deleteDoc(sizeRef)

            return NextResponse.json({msg: 'Size deleted successfully'})

        } catch (err) {
            console.log(`CATEGORY_DELETE: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }