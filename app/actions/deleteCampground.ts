"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteCampground(id: string) {
  const supabase = await createClient();

  // ✅ Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { error: "You must be logged in to delete a campground." };
  }

  // ✅ Get the campground to check ownership
  const { data: campground, error: fetchError } = await supabase
    .from("campgrounds")
    .select("id, imageUrl, user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { error: "Failed to verify campground ownership" };
  }

  // ✅ Verify ownership
  if (campground.user_id !== user.id) {
    return { error: "You do not have permission to delete this campground" };
  }

  // ✅ Delete the associated image from Supabase Storage
  if (campground.imageUrl && Array.isArray(campground.imageUrl)) {
    const filePaths = campground.imageUrl.map((url: string) => {
      const segments = url.split("/");
      return `campgrounds/${segments[segments.length - 1]}`;
    });
    const { error: storageError } = await supabase.storage
      .from("campground-images")
      .remove(filePaths);

    if (storageError) {
      console.error("Error deleting images:", storageError);
      // Continue with campground deletion even if image deletion fails
    }
  }

  // ✅ Delete the campground
  const { error: deleteError } = await supabase
    .from("campgrounds")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  return { success: true };
}
