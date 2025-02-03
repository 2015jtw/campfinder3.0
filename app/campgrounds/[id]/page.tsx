// React/NextJS
import React from "react";
import Image from "next/image";

// UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// server actions + supabase
import { createClient } from "@/lib/supabase/server";
// import { deleteCampground } from "@/app/actions/deleteCampground";

const page = async ({ params }: { params: { id: string } }) => {
  const supabase = await createClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from("campgrounds")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading campground</div>;
  }

  return (
    <section className="w-full h-screen py-20 bg-gray-100">
      <div className="container px-4 mx-auto bg-white flex justify-between py-10">
        <div className="h-full w-1/2 flex flex-col">
          <Card className="shadow-lg">
            <CardHeader>
              <Image
                src={data.imageUrl ?? "/placeholder.svg"}
                alt={data.title ?? "Campground Image"}
                width={400}
                height={300}
              />
            </CardHeader>
            <CardContent>
              <p>{data.title}</p>
              <p>{data.author}</p>
              <p>Campground ID: {id}</p>
              <p>{data.description}</p>
              <p>{data.location}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant={"default"}>Edit</Button>
              <Button variant={"destructive"}>Delete</Button>
            </CardFooter>
          </Card>
        </div>
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

export default page;
