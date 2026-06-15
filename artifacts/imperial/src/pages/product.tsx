import { Layout } from "@/components/layout";
import { useGetProduct } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useParams } from "wouter";
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Product() {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useGetProduct(handle || "", {
    query: { enabled: !!handle }
  });
  
  const { addToCart, isLoading: isCartLoading } = useCart();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // Initialize default options when product loads
  useMemo(() => {
    if (product && Object.keys(selectedOptions).length === 0) {
      const defaults: Record<string, string> = {};
      const firstVariant = product.variants[0];
      if (firstVariant) {
        firstVariant.selectedOptions.forEach(opt => {
          defaults[opt.name] = opt.value;
        });
        setSelectedOptions(defaults);
      }
    }
  }, [product]);

  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const currentVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find(variant => {
      return variant.selectedOptions.every(
        opt => selectedOptions[opt.name] === opt.value
      );
    }) || product.variants[0];
  }, [product, selectedOptions]);

  const availableOptions = useMemo(() => {
    if (!product) return [];
    const optionsMap = new Map<string, Set<string>>();
    
    product.variants.forEach(variant => {
      variant.selectedOptions.forEach(opt => {
        if (!optionsMap.has(opt.name)) {
          optionsMap.set(opt.name, new Set());
        }
        optionsMap.get(opt.name)?.add(opt.value);
      });
    });
    
    return Array.from(optionsMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  }, [product]);

  const handleAddToCart = () => {
    if (currentVariant) {
      addToCart(currentVariant.id, 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <div className="flex flex-col gap-6 pt-8">
              <Skeleton className="h-12 w-3/4 rounded-none" />
              <Skeleton className="h-6 w-1/4 rounded-none" />
              <Skeleton className="h-24 w-full rounded-none mt-8" />
              <Skeleton className="h-12 w-full rounded-none mt-8" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold">Product Not Found</h1>
        </div>
      </Layout>
    );
  }

  const imageUrl = product.featuredImage?.url || product.images?.[0]?.url;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] bg-muted relative overflow-hidden border border-border">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-muted-foreground">NO IMAGE</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="aspect-square bg-muted border border-border overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col py-4 md:py-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground uppercase">
              {product.title}
            </h1>
            
            <div className="mt-4 text-xl font-mono text-muted-foreground">
              {currentVariant?.price.currencyCode} {currentVariant?.price.amount}
            </div>
            
            <div className="mt-8 prose prose-invert font-mono text-sm text-muted-foreground leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <div className="mt-12 space-y-8 border-t border-border pt-8">
              {availableOptions.map(option => (
                <div key={option.name}>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-4">
                    {option.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map(value => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionSelect(option.name, value)}
                          className={`
                            px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all border
                            ${isSelected 
                              ? 'bg-foreground text-background border-foreground font-bold' 
                              : 'bg-transparent text-foreground border-border hover:border-foreground'}
                          `}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button 
                onClick={handleAddToCart}
                disabled={!currentVariant?.availableForSale || isCartLoading}
                className="w-full h-16 rounded-none font-mono text-sm uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
              >
                {isCartLoading ? "Adding..." : currentVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <div>
                <span className="block font-bold text-foreground mb-2">Shipping</span>
                Complimentary worldwide shipping on all orders over $200.
              </div>
              <div>
                <span className="block font-bold text-foreground mb-2">Returns</span>
                Free returns within 14 days of delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
