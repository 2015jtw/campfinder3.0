"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CampgroundCard } from "@/components/CampgroundCard";
import Searchbar from "@/components/Searchbar";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
// import MapBoxMap from "@/components/Mapbox";

type Campground = Database["public"]["Tables"]["campgrounds"]["Row"];

export default function Page() {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const supabase = createClient();

  // Function to fetch campgrounds, optionally filtering by title
  const fetchCampgrounds = useCallback(
    async (searchTerm?: string) => {
      let query = supabase.from("campgrounds").select("*");
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching campgrounds", error);
      } else if (data) {
        setCampgrounds(data);
        console.log("campgrounds:", data);
      }
    },
    [supabase]
  );

  // Initial fetch of all campgrounds
  useEffect(() => {
    fetchCampgrounds();
  }, [fetchCampgrounds]);

  // Callback passed to Searchbar to trigger search
  const handleSearch = (searchTerm: string) => {
    fetchCampgrounds(searchTerm);
  };

  // Build markers array from campgrounds that have latitude & longitude
  const markers = campgrounds
    .filter((camp) => camp.latitude && camp.longitude)
    .map((camp) => ({
      latitude: camp.latitude as number,
      longitude: camp.longitude as number,
      title: camp.title ?? "Unknown Title",
    }));

  // Set a default center if there are markers, otherwise use [0,0]
  const center: [number, number] =
    markers.length > 0 ? [markers[0].longitude, markers[0].latitude] : [0, 0];

  return (
    <section className="py-12 bg-white w-full">
      <Searchbar onSearch={handleSearch} className="py-12" />
      {/* <div className="mb-12 h-96">
        <MapBoxMap markers={markers} center={center} zoom={[4]} />
      </div> */}
      <div className="container mx-auto px-4">
        {campgrounds.length === 0 ? (
          <p className="text-center text-gray-600">
            No campsites found with that title.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campgrounds.map((campground) => (
              <CampgroundCard
                key={campground.id}
                id={campground.id}
                title={campground.title ?? "Campground Title"}
                author={campground.author ?? "Author Name"}
                price={campground.price ?? "50"}
                location={campground.location ?? "Location"}
                imageUrl={
                  Array.isArray(campground.imageUrl)
                    ? campground.imageUrl
                    : [campground.imageUrl ?? "/placeholder.svg"]
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
