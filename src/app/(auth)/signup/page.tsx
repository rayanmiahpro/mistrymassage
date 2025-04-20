"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponce } from "@/types/ApiResponce";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {Loader2} from  "lucide-react"

import React from 'react'
import { signupSchema } from "@/schemas/signupSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function signUp() {

   const [username, setUsername] = useState("");
   const [usernameMessage, setUsernameMessage] = useState("");
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 500);
  
  const router = useRouter();

  const from = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })


  useEffect(() => {

    const checkUsername = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      
      try {
        
        const response = await axios.get(`/api/unice-username-cheack?username=${username}`);
        
        console.log(response);
        
        if (response.data.success) { 
          setUsernameMessage(response.data.message);
        }

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }

    checkUsername();

   },[username])

  
  const onSubmit = async (data: z.infer<typeof signupSchema>) => { 

    setIsSubmitting(true);

    try {
      const responce = await axios.post("/api/sign-up", data);

      if (responce.data.success) { 
        router.push(`/varify/${username}`);
      }
      setIsSubmitting(false);
    } catch (error) {
       console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponce>;
      
      setIsSubmitting(false);

    }
  }






  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...from}>
          <form onSubmit={from.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "username is unice"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className="text-muted text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <Input {...field} name="password" type="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
