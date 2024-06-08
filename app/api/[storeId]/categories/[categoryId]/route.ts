import { db } from "@/lib/firebase"
import { Billboards, Category } from "@/type-db"
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
    {params} : {params : {storeId: string, categoryId: string}}) => {
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

            const categoryRef = await getDoc(
                doc(db, 'stores', params.storeId, 'categories', params.categoryId)
            )

            if(categoryRef.exists()) {
                await updateDoc(
                    doc(db, 'stores', params.storeId, 'categories', params.categoryId),
                    {
                        ...categoryRef.data,
                        name,
                        billboardId,
                        billboardLabel,
                        updateAt: serverTimestamp(),
                    }
                )
            } else {
                return new NextResponse('Category not found', {status: 404})
            }

            const category = (
                await getDoc(
                    doc(db, 'stores', params.storeId, 'categories', params.categoryId)
                )
            ).data() as Category

            return NextResponse.json(category)

        } catch (err) {
            console.log(`CATEGORY_PATCH: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const DELETE = async (req: Request, 
    {params} : {params : {storeId: string, categoryId: string}}) => {
        try {
            const { userId } = auth()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            if(!params.categoryId) {
                return new NextResponse('Category id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const categoryRef = doc(db, 'stores', params.storeId, 'categories', params.categoryId)

            await deleteDoc(categoryRef)

            return NextResponse.json({msg: 'Category deleted successfully'})

        } catch (err) {
            console.log(`CATEGORY_DELETE: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }