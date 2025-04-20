"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/schemas/loginSchema";

export default function signUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const from = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifer: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    try {
      const responce = await signIn("credentials", {
        identifier: data.identifer,
        password: data.password,
        redirect: false,
      });

      if (responce?.error) {
        console.log("login feailed", responce.error);
        setIsSubmitting(false);
      }

      if (responce?.url) {
        router.push("/dashbord");
      }
    } catch (error) {
      console.log("login feailed", error);
      setIsSubmitting(false);
    }
  };

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
              name="identifer"
              control={from.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} name="email" placeholder="Email/Username" />

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
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
