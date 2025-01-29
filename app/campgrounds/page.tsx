import { CampgroundCard } from "@/components/CampgroundCard";
import { supabase } from "@/lib/supabase/supabaseClient";

export default async function Page() {
  const { data, error } = await supabase.from("campgrounds").select("*");
  if (error) console.error("Error fetching campgrounds", error);

  return (
    <section className="py-12 bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data &&
            data.map((campground) => (
              <CampgroundCard
                key={campground.id}
                id={campground.id}
                title={campground.title ?? "Campground Title"}
                author={campground.author ?? "Author Name"}
                price={campground.price ?? 50}
                location={campground.location ?? "Location"}
                imageUrl={campground.imageUrl ?? "/placeholder.svg"}
              />
            ))}
          {/* Add more CampgroundCard components as needed */}
        </div>
      </div>
    </section>
  );
}
