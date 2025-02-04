"use client";

// React/Next
import React, { useState } from "react";
import Image from "next/image";

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
import { Textarea } from "@/components/ui/textarea";

// Form Validations
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Database } from "@/types/supabase";

export const formSchema = z.object({
  title: z.string().min(2).max(50),
  author: z.string().min(2).max(50),
  price: z
    .string()
    .min(1)
    .transform((val) => parseFloat(val)),
  location: z.string().min(2).max(50),
  //   picture: z.custom<FileList>().optional(),
  description: z.string().min(2).max(500),
});

export type FormValues = z.infer<typeof formSchema> & {
  newImages?: FileList;
  deleteImages?: string[];
};

type Campground = Database["public"]["Tables"]["campgrounds"]["Row"];

interface EditCampgroundFormProps {
  campground: Campground;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const UpdateCampgroundForm = ({
  campground,
  onSubmit,
  onCancel,
}: EditCampgroundFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>(
    campground.imageUrl || []
  );
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: campground.title || "",
      author: campground.author || "",
      price: campground.price || 0,
      location: campground.location || "",
      description: campground.description || "",
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsSubmitting(true);
    await onSubmit({
      ...values,
      newImages: newImages ?? undefined,
      deleteImages,
    });
    setIsSubmitting(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setNewImages(e.target.files);
    }
  }

  function handleRemoveImage(imageUrl: string) {
    setDeleteImages([...deleteImages, imageUrl]);
    setCurrentImages(currentImages.filter((img) => img !== imageUrl));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input placeholder="15" type="number" step="0.01" {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Upload New Images</FormLabel>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Image Preview & Upload Section */}
        <div>
          <FormLabel>Current Images</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Campground image ${index}`}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Campground"}
        </Button>
        <Button variant="destructive" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  );
};

export default UpdateCampgroundForm;
