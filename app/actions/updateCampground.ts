"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateCampground(
  id: string,
  values: {
    title?: string;
    author?: string;
    description?: string;
    price?: string;
    location?: string;
    newImages?: FileList; // New images to upload
    deleteImages?: string[]; // Images to delete from storage
  }
) {
  const supabase = await createClient();

  console.log("Updating campground with id:", id);
  console.log("Values received:", values);

  // ✅ Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error("Auth error:", userError);

    return { error: "You must be logged in to update a campground." };
  }

  console.log("Authenticated user:", user.id);

  // ✅ Get the campground to check ownership
  const { data: campground, error: fetchError } = await supabase
    .from("campgrounds")
    .select(
      "id, user_id, title, author, price, location, description, imageUrl"
    )
    .eq("id", id)
    .single();

  if (fetchError || !campground) {
    console.error("Fetch error:", fetchError);

    return { error: "Failed to verify campground ownership." };
  }

  console.log("Campground found:", campground);

  if (campground.user_id !== user.id) {
    console.error("Unauthorized update attempt by user:", user.id);
    return { error: "You do not have permission to update this campground." };
  }

  // ✅ Update images
  let updatedImageUrls = campground.imageUrl || [];

  if (values.deleteImages && values.deleteImages.length > 0) {
    console.log("Deleting images:", values.deleteImages);

    // Remove from storage
    const { error: deleteError } = await supabase.storage
      .from("campground-images")
      .remove(
        values.deleteImages.map(
          (imgUrl) => `campgrounds/${imgUrl.split("/").pop()}`
        )
      );

    if (deleteError) {
      console.error("Error deleting images:", deleteError);
      return { error: "Failed to delete images." };
    }

    // Remove from database array
    updatedImageUrls = updatedImageUrls.filter(
      (url: string) => !values.deleteImages?.includes(url)
    );
  }

  // ✅ Upload new images
  if (values.newImages && values.newImages.length > 0) {
    console.log("Uploading new images...");
    for (const file of values.newImages) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `campgrounds/${fileName}`;

      // Upload image
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("campground-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        return { error: "Failed to upload new images." };
      }

      // Get new image URL and add it to array
      const publicUrl = supabase.storage
        .from("campground-images")
        .getPublicUrl(filePath).data.publicUrl;
      updatedImageUrls.push(publicUrl);
    }
  }

  // ✅ Update the campground (excluding image update)
  const { error: updateError } = await supabase
    .from("campgrounds")
    .update({
      title: values.title ?? campground.title,
      author: values.author ?? campground.author,
      price: values.price ?? campground.price,
      location: values.location ?? campground.location,
      description: values.description ?? campground.description,
      imageUrl: updatedImageUrls, // Store updated image array
    })
    .eq("id", id);

  if (updateError) {
    console.error("Update error:", updateError);
    return { error: `Failed to update campground: ${updateError.message}` };
  }

  console.log("Campground updated successfully!");
  return {
    success: true,
    updatedImages: updatedImageUrls, // Return the new image URLs
  };
}
