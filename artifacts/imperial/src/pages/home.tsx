import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { STATIC_PRODUCTS } from "@/data/static-products";

export default function Home() {
  const { data: apiProducts } = useListProducts({ first: 4 }, { query: { retry: false, queryKey: ["products", "home"] } });

  const featured = (apiProducts && apiProducts.length > 0)
    ? apiProducts.slice(0, 4)
    : STATIC_PRODUCTS.slice(0, 4);

  return (
    <Layout>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background z-10" />
          <img 
            src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
        </div>
        
        <div className="container relative z-20 px-4 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tighter uppercase text-foreground">
            Imperial
          </h1>
          <p className="mt-6 text-lg md:text-xl font-mono text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest">
            The silence is deliberate.
          </p>
          <div className="mt-10">
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-sm font-mono tracking-widest font-bold uppercase bg-primary text-primary-foreground border border-primary transition-all hover:bg-transparent hover:text-primary">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Featured</h2>
              <p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">Curated Selections</p>
            </div>
            <Link href="/shop" className="group hidden md:flex items-center text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-4 md:mt-0">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 text-xs font-mono tracking-widest font-bold uppercase border border-border text-foreground hover:bg-muted transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-8">
            DRESS WITH INTENTION
          </h2>
          <p className="text-muted-foreground font-mono leading-relaxed md:text-lg">
            Imperial is a premium streetwear brand for people who don't need to explain their taste. 
            Every piece is designed with structured precision, meant to be worn heavily and aged beautifully.
          </p>
        </div>
      </section>
    </Layout>
  );
}
