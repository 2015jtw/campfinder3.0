"use server";

import { createClient } from "@/lib/supabase/server";

export async function createCampground(values: {
  title: string;
  author: string;
  price: number;
  location: string;
  picture?: FileList;
  description: string;
}) {
  const supabase = await createClient();

  // ✅ Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { error: "You must be logged in to create a campground." };
  }

  const imageUrls: string[] = [];

  //   upload the image to the campground-images bucket
  if (values.picture && values.picture.length > 0) {
    for (const file of values.picture) {
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const filePath = `campgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("campground-images")
        .upload(filePath, file);

      if (uploadError) {
        return { error: `Image upload failed: ${uploadError.message}` };
      }

      const { data } = supabase.storage
        .from("campground-images")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        imageUrls.push(data.publicUrl); // Store the image URL in an array
      }
    }
  }

  // ✅ Insert the campground into the database
  const { error } = await supabase.from("campgrounds").insert([
    {
      title: values.title,
      author: values.author,
      price: values.price,
      location: values.location,
      description: values.description,
      user_id: user.id, // Associate campground with logged-in user
      imageUrl: imageUrls,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
