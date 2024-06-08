"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"


import Modal from "../modal";
import { 
  FormControl,
  FormField,
  FormItem, 
  FormDescription, 
  FormLabel, 
  FormMessage, 
  Form 
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";


const formSchema= z.object({
    name: z.string().min(3,{message : "Store name should be minimum 3 characters"})
})

export const StoreModal = ()=>{
    const StoreModal=useStoreModal()
    
    const [isLoading, setIsLoading]=useState(false)

    const form= useForm<z.infer<typeof formSchema>>({
        resolver :zodResolver(formSchema),
        defaultValues : {
            name: ""
        }
    });

    const onSubmit= async ( values : z.infer <typeof formSchema>)=> {

      try {
        setIsLoading(true);
        
        const response= await axios.post("/api/stores", values);
        toast.success("Store Created");
        window.location.assign(`/${response.data.id}`);
      } catch (error) {
        toast.error("Something were wrong");
      }finally
      {
        setIsLoading(false);
      }
      
    };

    return(
        <Modal
        title="Create a new store"
        description="Add a new store to manage the products and categories"
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
        >
          <div>
            <div className="space-y-4 py-2 pb-4">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name" render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Your store name..."
                            {... field}
                          />

                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                       )}
                      />
                      <div className=" pt-6 space-x-2 flex item-center justify-end w-full">
                        <Button disabled={isLoading} type="button" variant={"outline"} size={"sm"} >Cancel</Button>
                        <Button disabled={isLoading} type="submit" variant={"outline"} size={"sm"} >Continue</Button>
                      </div>
                  </form>
              </Form>
            </div>
          </div>
        </Modal>
    );

};


