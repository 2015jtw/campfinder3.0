"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateCampground(
  id: string,
  values: {
    title?: string;
    author?: string;
    description?: string;
    price?: number;
    location?: string;
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
    .select("id, user_id, title, author, price, location, description")
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

  // ✅ Update the campground (excluding image update)
  const { error: updateError } = await supabase
    .from("campgrounds")
    .update({
      title: values.title ?? campground.title,
      author: values.author ?? campground.author,
      price: values.price ?? campground.price,
      location: values.location ?? campground.location,
      description: values.description ?? campground.description,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Update error:", updateError);
    return { error: `Failed to update campground: ${updateError.message}` };
  }

  console.log("Campground updated successfully!");
  return { success: true };
}
