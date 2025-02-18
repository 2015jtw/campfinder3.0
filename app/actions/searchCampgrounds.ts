// app/actions/searchCampgrounds.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchCampgrounds(searchTerm: string = "") {
  const supabase = await createClient();

  if (!searchTerm.trim()) {
    // If no search term, return all campgrounds
    const { data, error } = await supabase.from("campgrounds").select("*");
    return { data, error };
  }

  // Search campgrounds by title using ilike for case-insensitive partial matches
  const { data, error } = await supabase
    .from("campgrounds")
    .select("*")
    .ilike("title", `%${searchTerm}%`);

  return { data, error };
}
