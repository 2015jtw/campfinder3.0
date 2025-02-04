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
import EditCampgroundForm from "@/components/EditCampgroundForm";
import { useToast } from "@/hooks/use-toast";

// server actions + supabase
import { createClient } from "@/lib/supabase/client";
import { deleteCampground } from "@/app/actions/deleteCampground";
import { updateCampground } from "@/app/actions/updateCampground";
import { Database } from "@/types/supabase";

// Form validation
import type { FormValues } from "@/components/EditCampgroundForm";

type Campground = Database["public"]["Tables"]["campgrounds"]["Row"];

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

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  console.log("Id:", id);

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
    console.log("Submitting update for:", values);
    const result = await updateCampground(id, values);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: "Campground updated successfully!",
      });
      setIsEditing(false); // Exit edit mode
      setCampground({ ...campground, ...values }); // Update UI
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!campground) return <p>Campground not found.</p>;

  return (
    <section className="w-full h-screen py-20 bg-gray-100">
      <div className="container px-4 mx-auto bg-white flex justify-between py-10">
        {isEditing ? (
          <EditCampgroundForm
            campground={campground}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="h-full w-1/2 flex flex-col">
            <Card className="shadow-lg">
              <CardHeader>
                <Image
                  src={campground.imageUrl ?? "/placeholder.svg"}
                  alt={campground.title ?? "Campground Image"}
                  width={400}
                  height={300}
                />
              </CardHeader>
              <CardContent>
                <p>{campground.title}</p>
                <p>{campground.author}</p>
                <p>{campground.description}</p>
                <p>{campground.location}</p>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button variant="edit" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        <div className="flex flex-col justify-center w-1/2">
          <div className="h-1/2 justify-center items-center flex border border-green-700 w-full">
            Map
          </div>
          <div className="h-1/2 justify-center items-center flex border border-blue-700 w-full">
            Reviews
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
