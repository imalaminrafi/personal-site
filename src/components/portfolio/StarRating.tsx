import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

export default function StarRating({ rating, size = "sm", className }: StarRatingProps) {
  const s = SIZES[size];
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            s,
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-zinc-300 dark:text-zinc-600"
          )}
        />
      ))}
    </div>
  );
}
