import Image from "next/image";
import { MapPin, Bed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Database } from "@/types/supabase";

type Campground = Database["public"]["Tables"]["campgrounds"]["Row"];

export function CampgroundCard({
  title,
  author,
  id,
  price,
  location,
  imageUrl,
}: Pick<
  Campground,
  "title" | "author" | "id" | "price" | "location" | "imageUrl"
>) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageUrl?.[0] || "/placeholder.svg"}
          alt={`View of ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="py-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">Posted by {author}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bed className="h-4 w-4" />
          <span className="text-sm">${price} per night</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/campgrounds/${id}`} passHref>
          <Button className="w-full">See Campground</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
