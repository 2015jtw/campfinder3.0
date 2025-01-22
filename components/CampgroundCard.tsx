import Image from "next/image";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

interface CampgroundCardProps {
  title: string;
  author: string;
  price: number;
  location: string;
  imageUrl: string;
  id: string;
}

export function CampgroundCard({
  title,
  author,
  id,
  price,
  location,
  imageUrl,
}: CampgroundCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`View of ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">Posted by {author}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="mt-2 font-semibold">${price}/night</div>
      </CardContent>
      <CardFooter>
        <Link href={`/campgrounds/${id}`} passHref>
          <Button className="w-full">See Campground</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
