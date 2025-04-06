"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SubmitButton from "../_components/submitButton";
import { useRouter } from "next/navigation";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

export default function Onboard() {
  const createProfile = api.user.onBoardProfile.useMutation();
  const router = useRouter();
  // 1. Define form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createProfile.mutate(
      {
        name: values.name,
        address: values.address,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.error("Failed to update profile");
          console.error(err);
          form.reset();
        },
      },
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-l from-green-100 to-amber-50">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-green-800">
            Set Up Your Profile
          </h2>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <SubmitButton text="Finish Setup" />
          </div>
        </form>
      </Form>
    </div>
  );
}
