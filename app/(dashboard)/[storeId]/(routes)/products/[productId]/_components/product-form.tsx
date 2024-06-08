"use client"; 

import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast";
import axios from "axios";

import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Category, Manufacturer, Product, Size, Brand } from "@/type-db"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { AlertModal } from "@/components/modal/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImagesUpload from "@/components/images-update";

interface ProductFormProps{
  initialData : Product,
  categories: Category[],
  sizes: Size[],
  manufacturers: Manufacturer[],
  brands: Brand[],
}

const formSchema= z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({url: z.string()}).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  category: z.string().min(1),
  size: z.string().optional(),
  manufacturer: z.string().optional(),
  brand: z.string().optional(),
});

export const ProductForm = ({ initialData, categories, sizes, manufacturers, brands }: ProductFormProps) => {
  const form= useForm<z.infer<typeof formSchema>>({
    resolver :zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      category: '',
      size: '',
      manufacturer: '',
      brand: '',
    },
  });

  const [isLoading,setIsLoading]= useState(false);
  const [open,setOpen]= useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Product" : "Create Product"; 
  const description= initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product Updated" : "Product Created"; 
  const action = initialData ? "Save Changes" : "Create Product"; 

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if(initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`, 
          data
        )
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      toast.success(toastMessage);
      router.push(`/${params.storeId}/products`)
    } catch (error) {
      toast.error("Something were wrong");
      
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      toast.success("Product Removed");
      router.push(`/${params.storeId}/products`)
      router.refresh();
    
    } catch (error) {
      toast.error("Something were wrong");

    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={()=> setOpen(false)}
        onConfirm={onDelete}
        loading= {isLoading}
      />

      <div className="flex items-center justify-center">
        <Heading title={title} description={description}/>
        {initialData && (
          <Button
            disabled={isLoading} 
            variant={"destructive"} 
            size={"icon"} 
            onClick={()=> setOpen(true)}
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>
    
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField 
            control={form.control}
            name="images"
            render={({field}) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImagesUpload
                    value={field.value.map(image => image.url)}
                    onChange={(urls) => {
                      field.onChange(urls.map(url => ({url})))
                    }}
                    onRemove={(url) => {
                      field.onChange(
                        field.value.filter(current => current.url !== url)
                      )
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          /> 
          
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name..."
                      {... field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="price" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={isLoading}
                      placeholder="0"
                      {... field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="category" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select category'
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />       

            <FormField 
              control={form.control}
              name="size" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>

                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select size'
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.value}>
                          {size.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />   

            <FormField 
              control={form.control}
              name="manufacturer" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>

                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select manufacturer'
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer.id} value={manufacturer.name}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            /> 

            <FormField 
              control={form.control}
              name="brand" 
              render={({field}) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>

                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select brand'
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            /> 

            <FormField 
              control={form.control}
              name="isFeatured" 
              render={({field}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will be on homepage under featured products.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> 

            <FormField 
              control={form.control}
              name="isArchived" 
              render={({field}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not be displayed inside the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> 
          </div>
        
          <Button disabled={isLoading} type="submit" size={"sm"}>{action}</Button>
      
        </form>
      </Form>
    </>
  )
}
