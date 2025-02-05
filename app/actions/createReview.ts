"use server";

import { createClient } from "@/lib/supabase/server";

export async function createReview({
  campgroundId,
  name,
  review,
  rating,
}: {
  campgroundId: string;
  name: string;
  review: string;
  rating: number;
}) {
  const supabase = await createClient();

  // ✅ Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error("Auth Error:", userError);
    return { error: "You must be logged in to submit a review." };
  }

  console.log("Submitting Review: ", {
    campgroundId,
    userId: user.id,
    name,
    review,
    rating,
  });

  // ✅ Insert review into Supabase
  const { data, error } = await supabase.from("reviews").insert([
    {
      campground_id: campgroundId,
      user_id: user.id,
      name,
      review,
      rating,
    },
  ]);

  if (error) {
    console.error("Insert Error:", error.message);
    return { error: error.message };
  }

  console.log("Review Successfully Inserted:", data);

  return { success: true };
}
