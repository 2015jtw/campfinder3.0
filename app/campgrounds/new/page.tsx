"use client";

// React/Next
import React from "react";

// Clerk
import { useAuth } from "@clerk/nextjs";

// UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form Validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

// supabase
import { supabase } from "@/lib/supabaseClient";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  author: z.string().min(2).max(50),
  price: z
    .string()
    .min(1, { message: "Price is required" })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Price must be a valid number",
    })
    .transform((val) => parseFloat(val)),
  location: z.string().min(2).max(50),
  picture: z.string().url(),
  description: z.string().min(2).max(500),
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      price: 0,
      location: "",
      picture: "",
    },
  });

  const { userId } = useAuth();

  console.log("User ID:", userId);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      console.log("You must be logged in to create a campground.");
      return;
    }

    try {
      const { error } = await supabase.from("campgrounds").insert([
        {
          title: values.title,
          price: values.price,
          location: values.location,
          imageUrl: values.picture,
          description: values.description,
          author: userId,
          id: userId,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.error("Error inserting data:", error);
        alert("Failed to create the campground. Please try again.");
        return;
      }

      alert("Campground created successfully!");
      form.reset(); // Reset the form
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(values);
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-center">Create New Campground</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campground Title</FormLabel>
                <FormControl>
                  <Input placeholder="Canyon Creek Campsite" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campground Author</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Moab, Utah" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default Page;
