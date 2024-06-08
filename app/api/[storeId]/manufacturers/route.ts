import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { 
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"
import { NextResponse } from "next/server"
import { Manufacturer } from "@/type-db"

export const POST = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
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

            const manufacturerData = {
                name,
                value,
                createAt: serverTimestamp()
            }

            const manufacturerRef = await addDoc(
                collection(db, 'stores', params.storeId, 'manufacturers'), 
                manufacturerData
            )

            const id = manufacturerRef.id

            await updateDoc(doc(db, 'stores', params.storeId, 'manufacturers', id), {
                ...manufacturerData,
                id,
                updateAt: serverTimestamp()
            })

            return NextResponse.json({id, ...manufacturerData})

        } catch (err) {
            console.log(`MANUFACTURERS_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const GET = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const manufacturersData = (
                await getDocs(
                    collection(doc(db, 'stores', params.storeId), 'manufacturers')
                )
            ).docs.map(doc => doc.data()) as Manufacturer[]

            return NextResponse.json(manufacturersData)

        } catch (err) {
            console.log(`MANUFACTURERS_GET: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }