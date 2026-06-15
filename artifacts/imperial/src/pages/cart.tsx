import { Layout } from "@/components/layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  const { cart, isLoading, updateQuantity } = useCart();

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  if (isLoading && !cart) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-4xl font-serif font-bold uppercase mb-12">Cart</h1>
          <div className="space-y-8">
            <Skeleton className="h-24 w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
          </div>
        </div>
      </Layout>
    );
  }

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase mb-12">
          Your Cart
        </h1>

        {isEmpty ? (
          <div className="text-center py-24 border border-dashed border-border bg-card/30">
            <p className="font-mono text-muted-foreground uppercase tracking-widest mb-8">
              Your cart is empty.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-mono tracking-widest font-bold uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="lg:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              
              {cart.lines.map((line) => (
                <div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 border-b border-border">
                  <div className="col-span-1 md:col-span-6 flex gap-6">
                    <Link href={`/products/${line.merchandise.product.handle}`} className="shrink-0 w-24 h-32 bg-muted overflow-hidden border border-border">
                      {line.merchandise.image ? (
                        <img 
                          src={line.merchandise.image.url} 
                          alt={line.merchandise.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-muted-foreground">NO IMG</div>
                      )}
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${line.merchandise.product.handle}`} className="font-serif text-lg font-bold uppercase hover:text-primary transition-colors">
                        {line.merchandise.product.title}
                      </Link>
                      <div className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest space-y-1">
                        {line.merchandise.selectedOptions.map(opt => (
                          <div key={opt.name}>{opt.name}: {opt.value}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                    <span className="md:hidden font-mono text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
                    <div className="flex items-center border border-border">
                      <button 
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center font-mono text-sm">{line.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center font-mono text-sm">
                    <span className="md:hidden font-mono text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                    <div className="flex items-center gap-4">
                      <span>{line.cost.totalAmount.currencyCode} {line.cost.totalAmount.amount}</span>
                      <button 
                        onClick={() => updateQuantity(line.id, 0)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-4"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-8 sticky top-24">
                <h3 className="font-serif text-2xl font-bold uppercase mb-8">Summary</h3>
                
                <div className="space-y-4 font-mono text-sm mb-8 pb-8 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{cart.cost.subtotalAmount.currencyCode} {cart.cost.subtotalAmount.amount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-mono font-bold text-lg mb-8">
                  <span>Total</span>
                  <span>{cart.cost.totalAmount.currencyCode} {cart.cost.totalAmount.amount}</span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-16 rounded-none font-mono text-sm uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Checkout Securely
                </Button>
                
                <p className="mt-6 text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
