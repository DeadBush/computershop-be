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
import { Billboards } from "@/type-db"


export const POST = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { label, imageUrl } = body

            if(!label) {
                return new NextResponse('Billboard name is missing!', { status: 400 })
            }

            if(!imageUrl) {
                return new NextResponse('Billboard image is missing!', { status: 400 })
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

            const billboardData = {
                label,
                imageUrl,
                createAt: serverTimestamp()
            }

            const billboardRef = await addDoc(
                collection(db, 'stores', params.storeId, 'billboards'), 
                billboardData
            )

            const id = billboardRef.id

            await updateDoc(doc(db, 'stores', params.storeId, 'billboards', id), {
                ...billboardData,
                id,
                updateAt: serverTimestamp()
            })

            return NextResponse.json({id, ...billboardData})

        } catch (err) {
            console.log(`STORE_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const GET = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const billboardData = (
                await getDocs(
                    collection(doc(db, 'stores', params.storeId), 'billboards')
                )
            ).docs.map(doc => doc.data()) as Billboards[]

            return NextResponse.json(billboardData)

        } catch (err) {
            console.log(`STORE_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }