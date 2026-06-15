import { Layout } from "@/components/layout";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Shop() {
  const { data: products, isLoading } = useListProducts();
  const [filter, setFilter] = useState<"All" | "Shirts" | "Shorts">("All");

  const filteredProducts = products?.filter(p => {
    if (filter === "All") return true;
    if (filter === "Shirts") return p.productType?.toLowerCase().includes("shirt");
    if (filter === "Shorts") return p.productType?.toLowerCase().includes("short");
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Collection</h1>
          <p className="mt-4 font-mono text-sm text-muted-foreground max-w-md uppercase tracking-widest leading-relaxed">
            Every piece serves a purpose. Select your uniform.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8 border-b border-border pb-4">
          <div className="flex flex-wrap gap-4 font-mono text-sm uppercase tracking-widest">
            {["All", "Shirts", "Shorts"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`pb-1 border-b-2 transition-colors ${filter === f ? "border-primary text-foreground font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {isLoading ? "Loading..." : `${filteredProducts?.length || 0} Products`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[3/4] rounded-none bg-muted/50" />
                <Skeleton className="w-3/4 h-6 rounded-none bg-muted/50" />
                <Skeleton className="w-1/4 h-4 rounded-none bg-muted/50" />
              </div>
            ))}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border bg-card/50">
            <h3 className="font-serif text-2xl font-bold">No products found</h3>
            <p className="font-mono text-muted-foreground mt-2 text-sm uppercase tracking-widest">Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts?.map((product) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-both">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
