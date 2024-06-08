import { db } from "@/lib/firebase"
import { Brand } from "@/type-db"
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
    {params} : {params : {storeId: string, brandId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { name, value } = body

            if(!name) {
                return new NextResponse('Brand name is missing!', { status: 400 })
            }

            if(!value) {
                return new NextResponse('Brand value is missing!', { status: 400 })
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

            const brandRef = await getDoc(
                doc(db, 'stores', params.storeId, 'brands', params.brandId)
            )

            if(brandRef.exists()) {
                await updateDoc(
                    doc(db, 'stores', params.storeId, 'brands', params.brandId),
                    {
                        ...brandRef.data,
                        name,
                        value,
                        updateAt: serverTimestamp(),
                    }
                )
            } else {
                return new NextResponse('Brand not found', {status: 404})
            }

            const brand = (
                await getDoc(
                    doc(db, 'stores', params.storeId, 'brands', params.brandId)
                )
            ).data() as Brand

            return NextResponse.json(brand)

        } catch (err) {
            console.log(`BRAND_PATCH: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const DELETE = async (req: Request, 
    {params} : {params : {storeId: string, brandId: string}}) => {
        try {
            const { userId } = auth()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            if(!params.brandId) {
                return new NextResponse('Brand id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const brandRef = doc(db, 'stores', params.storeId, 'brands', params.brandId)

            await deleteDoc(brandRef)

            return NextResponse.json({msg: 'Brand deleted successfully'})

        } catch (err) {
            console.log(`BRAND_DELETE: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }