"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";

type Campground = Database["public"]["Tables"]["campgrounds"]["Insert"];

const formSchema = z.object({
  title: z.string().min(2).max(50),
  author: z.string().min(2).max(50),
  price: z
    .string()
    .min(1)
    .transform((val) => parseFloat(val)), // Change to string
  location: z.string().min(2).max(50),
  picture: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      {
        message: "Max file size is 5MB.",
      }
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type
        ),
      {
        message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
      }
    ),
  description: z.string().min(2).max(500),
});

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      location: "",
      picture: undefined,
    },
  });

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload the file to Supabase storage
      const { error } = await supabase.storage
        .from("campground-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("campground-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      console.error("You must be logged in to create a campground.");
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the user in Supabase using clerk_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (userError || !userData) {
        console.error("Error finding user:", userError);
        setIsSubmitting(false);
        return;
      }

      // Handle image upload if provided
      let imageUrl = null;
      if (values.picture && values.picture.length > 0) {
        const file = values.picture[0];
        imageUrl = await handleImageUpload(file);

        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      const newCampground: Campground = {
        title: values.title,
        author: values.author,
        price: values.price,
        location: values.location,
        imageUrl: imageUrl,
        description: values.description,
        user_id: userData.id, // Using the correct field name from your schema
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("campgrounds")
        .insert([newCampground]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      form.reset();
      router.push("/campgrounds");
    } catch (error) {
      console.error("Error creating campground:", error);
      alert("Failed to create campground. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create New Campground
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-xl mx-auto"
        >
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
                <FormLabel>Price per night</FormLabel>
                <FormControl>
                  <Input
                    placeholder="15"
                    type="number"
                    step="0.01"
                    {...field}
                  />
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
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      if (e.target.files?.[0]) {
                        // Preview logic could be added here
                      }
                    }}
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
                  <Textarea
                    placeholder="Describe your campground..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Campground"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Page;
