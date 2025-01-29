"use client";

// React/Next
import React, { useState, useEffect } from "react";

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
import { supabase } from "@/lib/supabase/supabaseClient";

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
  picture: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      {
        message: "Max file size is 5MB.",
      }
    ),

  description: z.string().min(2).max(500),
});

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      price: 0,
      location: "",
      picture: undefined,
    },
  });

  const { userId } = useAuth();

  // Fetch Supabase user ID when component mounts or clerk userId changes
  useEffect(() => {
    async function getSupabaseUserId() {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", userId)
          .single();

        if (error) {
          console.error("Error fetching Supabase user:", error);
          return;
        }

        if (data) {
          setSupabaseUserId(data.id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getSupabaseUserId();
  }, [userId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId || !supabaseUserId) {
      console.log("You must be logged in to create a campground.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = null;

    if (values.picture && values.picture.length > 0) {
      const file = values.picture[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("campground-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Error uploading image:", error.message);
        alert("Image upload failed.");
        setIsSubmitting(false);
        return;
      }

      imageUrl = supabase.storage
        .from("campground-images")
        .getPublicUrl(filePath).data.publicUrl;
    }

    try {
      const { error } = await supabase.from("campgrounds").insert([
        {
          title: values.title,
          price: values.price,
          location: values.location,
          imageUrl,
          description: values.description,
          author: values.author,
          created_at: new Date().toISOString(),
          user_id: supabaseUserId, // Use the Supabase user ID here
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
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Page;
