import { createClerkSupabaseClientSsr } from "./supabase/ClerkSupabaseClient";

export async function generateImageFilename(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  return `campgrounds/${userId}-${Date.now()}.${fileExt}`;
}

export async function uploadImage(
  userId: string,
  file: File
): Promise<string | null> {
  if (!file) return null;

  const supabase = await createClerkSupabaseClientSsr();
  const filePath = await generateImageFilename(userId, file);

  const { data, error } = await supabase.storage
    .from("campground-images")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }

  return supabase.storage.from("campground-images").getPublicUrl(filePath).data
    .publicUrl;
}
