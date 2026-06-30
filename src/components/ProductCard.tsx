import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/api";
import { PriceTag } from "./PriceTag";
import { RatingStars } from "./RatingStars";
import { categoryLabel } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden transition-transform active:scale-[0.98]">
        <div className="aspect-square bg-muted/50 overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
              {categoryLabel(product.category)}
            </span>
            <RatingStars value={product.rating} />
          </div>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="pt-1">
            <PriceTag amount={product.price} />
          </div>
        </div>
      </div>
    </Link>
  );
}
