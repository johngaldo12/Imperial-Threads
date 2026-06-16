import { useState } from "react";
import { Layout } from "@/components/layout";
import { useLocalCart } from "@/hooks/use-local-cart";
import { useAuth } from "@/contexts/auth-context";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, Trash2, MapPin, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { cart, isLoading, updateQuantity, clearCart } = useLocalCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
  });
  const [orderPlaced, setOrderPlaced] = useState<null | { orderNumber: string }>(null);

  const handlePlaceOrder = async () => {
    if (!cart || cart.lines.length === 0) return;
    setCheckoutLoading(true);
    try {
      const items = cart.lines.map((line) => ({
        name: line.productTitle,
        variant: line.variantTitle,
        quantity: line.quantity,
        price: line.price,
      }));
      const total = parseFloat(cart.cost.totalAmount.amount);
      const result = await createOrder.mutateAsync({
        data: {
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          shippingAddress: checkoutForm.address,
          totalAmount: Math.round(total),
          items,
          currency: cart.cost.totalAmount.currencyCode,
        },
      });
      setOrderPlaced({ orderNumber: result.orderNumber });
      localStorage.setItem("last_order_number", result.orderNumber);
      clearCart();
    } catch (err: any) {
      toast({
        title: "Checkout failed",
        description: err?.data?.error || "Could not place order. Try again.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isLoading) {
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

        {orderPlaced ? (
          <div className="text-center py-24 border border-border bg-card">
            <CreditCard className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="font-serif text-3xl font-bold uppercase mb-4">Order Confirmed</h2>
            <p className="font-mono text-sm text-muted-foreground mb-2 uppercase tracking-widest">
              Your order number
            </p>
            <p className="font-mono text-2xl font-bold text-primary mb-8">{orderPlaced.orderNumber}</p>
            <p className="font-mono text-xs text-muted-foreground mb-8 max-w-md mx-auto uppercase tracking-wider">
              Save this number. Use it to track your order on the Track Order page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/track" className="inline-flex items-center justify-center px-8 py-4 text-sm font-mono tracking-widest font-bold uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Track Order
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-sm font-mono tracking-widest font-bold uppercase border border-border hover:border-primary hover:text-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : isEmpty ? (
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
                <div key={line.variantId} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 border-b border-border">
                  <div className="col-span-1 md:col-span-6 flex gap-6">
                    <Link href={`/products/${line.productHandle}`} className="shrink-0 w-24 h-32 bg-muted overflow-hidden border border-border">
                      {line.imageUrl ? (
                        <img
                          src={line.imageUrl}
                          alt={line.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-muted-foreground">NO IMG</div>
                      )}
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${line.productHandle}`} className="font-serif text-lg font-bold uppercase hover:text-primary transition-colors">
                        {line.productTitle}
                      </Link>
                      <div className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest space-y-1">
                        <div>{line.variantTitle}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                    <span className="md:hidden font-mono text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center font-mono text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
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
                      <span>{line.currencyCode} {(line.price * line.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => updateQuantity(line.variantId, 0)}
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
                
                {showCheckoutForm ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        required
                        type="text"
                        placeholder="Shipping address"
                        value={checkoutForm.address}
                        onChange={e => setCheckoutForm(p => ({ ...p, address: e.target.value }))}
                        className="w-full bg-background border border-border pl-10 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="Full name"
                      value={checkoutForm.name}
                      onChange={e => setCheckoutForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={checkoutForm.email}
                      onChange={e => setCheckoutForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={checkoutLoading || !checkoutForm.name || !checkoutForm.email || !checkoutForm.address}
                      className="w-full h-14 rounded-none font-mono text-sm uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {checkoutLoading ? "Processing..." : "Place Order"}
                    </Button>
                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="w-full h-10 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowCheckoutForm(true)}
                    disabled={isLoading}
                    className="w-full h-16 rounded-none font-mono text-sm uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Place Order
                  </Button>
                )}
                
                <p className="mt-6 text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Cash on delivery / Bank transfer
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
