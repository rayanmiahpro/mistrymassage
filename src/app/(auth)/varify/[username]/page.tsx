"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validationSchema } from '@/schemas/validitionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import {  useForm } from 'react-hook-form';
import { z } from 'zod';

function varify() {

    const params = useParams()
    const router = useRouter()

    const from = useForm <z.infer<typeof validationSchema>>({
        resolver:zodResolver(validationSchema)
    })


   const onSubmit = async (data: z.infer<typeof validationSchema>) => {

       try {
         const response = await axios.post(`/api/varify-user`, {
             username: params.username,
             varifyCode: data.varificationCode
         })
           
           if (response.data.success) { 
             router.push(`/login`)
           }
       } catch (error) {
        console.error("error varifying user:", error);
            
       }

    }


  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Form {...from}>
        <form onSubmit={from.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="varificationCode"
            control={from.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Varification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Varification Code" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default varify