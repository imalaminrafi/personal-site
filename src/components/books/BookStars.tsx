import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" };

export default function BookStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(s, i <= filled ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700")}
        />
      ))}
    </span>
  );
}
