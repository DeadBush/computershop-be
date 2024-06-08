import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { z } from "zod";

const storeSchema = z.object({
  name: z.string().min(3, "Store name is required 3 letter"),
});
{/* 
export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = storeSchema.parse(body);

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    };

    const storeRef = await addDoc(collection(db, "stores"), storeData);
    const id = storeRef.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...storeData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors.join(", "), { status: 400 });
    }
    console.error("STORE_POST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
*/}
export const POST= async(req: Request)=> {
    
  try
  {       
      const {userId}= auth();
      const body=await req.json()

      if(!userId)
          {
              return new NextResponse("Un-Authorized", {status : 400})
          }

          const {name} =body;
          
          if(!name){
              return new NextResponse("Store Name is missing!", {status:400})
          }

          const storeData= {
              name,
              userId,
              CreateAt : serverTimestamp()

              
          }

      // Add the data to the firestore and retrive its reference id
          
          const storeRef = await addDoc(collection (db, "stores"),storeData);

      // Get the reference ID
       const id=storeRef.id  
       
       await updateDoc(doc(db, "stores",id),{
          ...storeData,
          id,
          updateAt : serverTimestamp()

       })

       return NextResponse.json({id,...storeData})

  }catch (error)
  {
      console.log('STORE_POST: ${error}')
      return new NextResponse("Internal Server Error", {status : 500})
  }

};