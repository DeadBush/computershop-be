import { db } from "@/lib/firebase"
import { Manufacturer } from "@/type-db"
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
    {params} : {params : {storeId: string, manufacturerId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { name, value } = body

            if(!name) {
                return new NextResponse('Manufacturer name is missing!', { status: 400 })
            }

            if(!value) {
                return new NextResponse('Manufacturer value is missing!', { status: 400 })
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

            const manufacturerRef = await getDoc(
                doc(db, 'stores', params.storeId, 'manufacturers', params.manufacturerId)
            )

            if(manufacturerRef.exists()) {
                await updateDoc(
                    doc(db, 'stores', params.storeId, 'manufacturers', params.manufacturerId),
                    {
                        ...manufacturerRef.data,
                        name,
                        value,
                        updateAt: serverTimestamp(),
                    }
                )
            } else {
                return new NextResponse('Manufacturer not found', {status: 404})
            }

            const manufacturer = (
                await getDoc(
                    doc(db, 'stores', params.storeId, 'manufacturers', params.manufacturerId)
                )
            ).data() as Manufacturer

            return NextResponse.json(manufacturer)

        } catch (err) {
            console.log(`MANUFACTURER_PATCH: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const DELETE = async (req: Request, 
    {params} : {params : {storeId: string, manufacturerId: string}}) => {
        try {
            const { userId } = auth()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            if(!params.manufacturerId) {
                return new NextResponse('Manufacturer id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const manufacturerRef = doc(db, 'stores', params.storeId, 'manufacturers', params.manufacturerId)

            await deleteDoc(manufacturerRef)

            return NextResponse.json({msg: 'Manufacturer deleted successfully'})

        } catch (err) {
            console.log(`MANUFACTURER_DELETE: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }