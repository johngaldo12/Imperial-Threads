import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.featuredImage?.url || product.images?.[0]?.url;
  
  return (
    <Link href={`/products/${product.handle}`} className="group block h-full">
      <div className="flex flex-col h-full overflow-hidden bg-card border border-border transition-all duration-300 hover:border-primary/50">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.featuredImage?.altText || product.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
              NO IMAGE
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-wider">
              {product.productType || "Apparel"}
            </p>
          </div>
          <div className="mt-4 font-mono text-sm">
            {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
          </div>
        </div>
      </div>
    </Link>
  );
}
