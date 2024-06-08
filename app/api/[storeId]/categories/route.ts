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
import { Category } from "@/type-db"


export const POST = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { name, billboardLabel, billboardId } = body

            if(!name) {
                return new NextResponse('Category name is missing!', { status: 400 })
            }

            if(!billboardId) {
                return new NextResponse('Billboard id is missing!', { status: 400 })
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

            const categoryData = {
                name,
                billboardId,
                billboardLabel,
                createAt: serverTimestamp()
            }

            const categoryRef = await addDoc(
                collection(db, 'stores', params.storeId, 'categories'), 
                categoryData
            )

            const id = categoryRef.id

            await updateDoc(doc(db, 'stores', params.storeId, 'categories', id), {
                ...categoryData,
                id,
                updateAt: serverTimestamp()
            })

            return NextResponse.json({id, ...categoryData})

        } catch (err) {
            console.log(`CATEGORIES_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const GET = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const categoriesData = (
                await getDocs(
                    collection(doc(db, 'stores', params.storeId), 'categories')
                )
            ).docs.map(doc => doc.data()) as Category[]

            return NextResponse.json(categoriesData)

        } catch (err) {
            console.log(`CATEGORIES_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }