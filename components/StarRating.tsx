import { Star, StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[...Array(maxRating)].map((_, index) => (
        <span key={index} className="text-yellow-400">
          {index < rating ? (
            <StarIcon className="w-4 h-4 fill-current" />
          ) : (
            <Star className="w-4 h-4" />
          )}
        </span>
      ))}
    </div>
  );
}
