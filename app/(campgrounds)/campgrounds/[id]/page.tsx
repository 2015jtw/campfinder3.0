"use client";

// React/NextJS
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

// UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EditCampgroundForm from "@/components/UpdateCampgroundForm";
import { useToast } from "@/hooks/use-toast";
import ReviewForm from "@/components/ReviewsForm";
import { StarRating } from "@/components/StarRating";
import { User, MapPin, Bed } from "lucide-react";

// server actions + supabase
import { createClient } from "@/lib/supabase/client";
import { deleteCampground } from "@/app/actions/deleteCampground";
import { updateCampground } from "@/app/actions/updateCampground";
import { Database } from "@/types/supabase";

// Form validation
import type { FormValues } from "@/components/UpdateCampgroundForm";

type Campground = Database["public"]["Tables"]["campgrounds"]["Row"];
type Review = Database["public"]["Tables"]["reviews"]["Row"];

const Page = () => {
  const { toast } = useToast();
  const [campground, setCampground] = useState<Campground>({
    author: null,
    created_at: "",
    description: null,
    id: "",
    imageUrl: null,
    location: null,
    price: null,
    title: null,
    user_id: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function fetchCampgrounds() {
      const { data, error } = await supabase
        .from("campgrounds")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error fetching campground.",
        });
      } else {
        setCampground(data);
      }
      setIsLoading(false);
    }
    fetchCampgrounds();
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("campground_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error fetching reviews.",
        });
      } else {
        setReviews(data);
      }
    }
    fetchReviews();

    const subscription = supabase
      .channel("reviews-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          console.log("New review added:", payload);

          // ✅ Cast payload.new as a Review object
          setReviews((prev) => [payload.new as Review, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteCampground(id);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: "Campground deleted successfully!",
      });
      router.push("/campgrounds");
    }
  }

  async function handleUpdate(values: FormValues) {
    const result = await updateCampground(id, values);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      return { error: result.error };
    }

    // Update local state
    setCampground((prev) => ({
      ...prev,
      ...values,
      imageUrl: result?.updatedImages || prev.imageUrl,
    }));

    // Force revalidation
    router.refresh();

    // Refetch campground data
    const { data } = await supabase
      .from("campgrounds")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setCampground(data);
    }

    setIsEditing(false);
    toast({
      title: "Success",
      description: "Campground updated successfully!",
    });

    return {
      success: true,
      updatedImages: result?.updatedImages || campground.imageUrl,
    };
  }

  if (isLoading) return <p>Loading...</p>;
  if (!campground) return <p>Campground not found.</p>;
  if (!reviews) return <p>No reviews found.</p>;

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 bg-white flex flex-col md:flex-row justify-between py-10 gap-4">
        {isEditing ? (
          <EditCampgroundForm
            campground={campground}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="h-full md:w-2/3 flex flex-col">
            <Card className="shadow-lg">
              <CardHeader>
                <Carousel className="w-full;">
                  <CarouselContent>
                    {campground?.imageUrl?.map((img, index) => (
                      <CarouselItem key={index} className="w-full">
                        <Image
                          key={`${img}?${Date.now()}`} // Add cache-busting key
                          src={img} // Display image from array
                          alt={`Campground image ${index + 1}`}
                          width={500}
                          height={300}
                          className="w-full h-[300px] object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{campground.title}</h2>
                  </div>

                  <div className="flex justify-start gap-x-8">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-gray-800">
                          ${campground.price}{" "}
                          <span className="">per night</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-gray-800">{campground.author}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-gray-800">{campground.location}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">
                      Description:
                    </span>
                    <p className="text-gray-600">{campground.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="edit"
                  onClick={() => setIsEditing(true)}
                  className="w-20"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-20"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        <div className="flex flex-col w-full md:w-1/3">
          <div className="flex flex-col">
            <div className="px-4">
              <h3 className="text-lg font-bold mb-2">Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="mb-4 p-2 border rounded-md">
                    <div className="gap-2 flex flex-col">
                      <p className="text-sm font-bold">{review.name}</p>
                      <div className="flex items-center gap-1">
                        <StarRating rating={review.rating ?? 0} />
                        <span className="text-sm text-gray-500">
                          ({review.rating}/5)
                        </span>
                      </div>
                      <p className="text-sm">{review.review}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
              {!showReviewForm && (
                <Button
                  className="mt-3"
                  variant={"outline"}
                  onClick={() => setShowReviewForm(true)}
                >
                  Add Review
                </Button>
              )}
              {showReviewForm && (
                <ReviewForm
                  campgroundId={id}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
