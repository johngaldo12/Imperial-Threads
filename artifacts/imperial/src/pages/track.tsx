import { Layout } from "@/components/layout";
import { useState } from "react";
import { useGetOrder } from "@workspace/api-client-react";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

type OrderStatus = "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "not_found";

interface TrackingStep {
  label: string;
  description: string;
  date: string;
  done: boolean;
  active: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  processing: "text-yellow-400",
  shipped: "text-blue-400",
  out_for_delivery: "text-orange-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
  not_found: "text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  not_found: "Not Found",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  processing: <Clock className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  out_for_delivery: <Truck className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
  cancelled: <AlertCircle className="w-5 h-5" />,
  not_found: <AlertCircle className="w-5 h-5" />,
};

export default function Track() {
  const [form, setForm] = useState({ email: "", orderNumber: "" });
  const [searched, setSearched] = useState(false);
  const [lookupOrder, setLookupOrder] = useState<string>("");

  const orderQuery = useGetOrder(lookupOrder, {
    query: { enabled: !!lookupOrder, retry: false, queryKey: ["order", lookupOrder] },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setLookupOrder(form.orderNumber.toUpperCase().trim());
  };

  const handleReset = () => {
    setSearched(false);
    setLookupOrder("");
    setForm({ email: "", orderNumber: "" });
  };

  const isNotFound = searched && !orderQuery.isLoading && orderQuery.isError;
  const result = orderQuery.data;
  const steps = result?.timeline as TrackingStep[] | undefined;
  const status = result?.status as OrderStatus | undefined;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-2xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Track Order</h1>
          <p className="mt-4 font-mono text-sm text-muted-foreground max-w-md uppercase tracking-widest leading-relaxed">
            Enter your order number and email to see your delivery status.
          </p>
        </header>

        {!searched ? (
          <form onSubmit={handleSearch} className="border border-border bg-card p-6 flex flex-col gap-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Order Number
              </label>
              <input
                required
                type="text"
                placeholder="e.g. IMP-00123"
                value={form.orderNumber}
                onChange={e => setForm(p => ({ ...p, orderNumber: e.target.value }))}
                className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors uppercase"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="The email used for your order"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={orderQuery.isLoading}
              className="w-full h-14 bg-primary text-primary-foreground font-mono text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-1"
            >
              <Search className="w-4 h-4" />
              {orderQuery.isLoading ? "Loading..." : "Track My Order"}
            </button>

            <p className="font-mono text-xs text-muted-foreground text-center uppercase tracking-wider">
              Order number is in your confirmation email &mdash; starts with IMP-
            </p>
          </form>
        ) : isNotFound ? (
          <div className="border border-border bg-card p-8 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-4 text-red-400" />
            <h2 className="font-serif text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="font-mono text-sm text-muted-foreground mb-6 uppercase tracking-widest">
              We couldn't find an order with that number and email combination.
            </p>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Double-check your order number (e.g. IMP-00123) and make sure the email matches the one used at checkout.
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 border border-border font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : result ? (
          <div className="flex flex-col gap-6">
            <div className="border border-border bg-card p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">Order</p>
                  <p className="font-mono text-sm font-bold">{result.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                  <p className="font-mono text-sm">{result.currency} {result.totalAmount}</p>
                </div>
                <div className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest ${STATUS_COLORS[result.status]}`}>
                  {STATUS_ICONS[result.status]}
                  {STATUS_LABELS[result.status]}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Items</p>
                <div className="space-y-1">
                  {(result.items as Array<{ name: string; variant: string; quantity: number }>)?.map((item, i) => (
                    <p key={i} className="font-mono text-sm">{item.name} — {item.variant} x{item.quantity}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold mb-8 uppercase">Delivery Timeline</h2>
              <div className="relative flex flex-col gap-0">
                {steps?.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        step.active
                          ? "bg-primary border-primary text-primary-foreground"
                          : step.done
                            ? "bg-muted border-muted-foreground text-foreground"
                            : "bg-transparent border-border text-muted-foreground"
                      }`}>
                        {step.done || step.active ? (
                          <Package className="w-4 h-4" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>
                      {i < (steps?.length ?? 0) - 1 && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[2rem] ${step.done ? "bg-muted-foreground/50" : "bg-border"}`} />
                      )}
                    </div>
                    <div className={`pb-8 ${i === (steps?.length ?? 0) - 1 ? "pb-0" : ""}`}>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <p className={`font-mono text-sm font-bold uppercase tracking-wider ${step.active ? "text-primary" : step.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">{step.date}</p>
                      </div>
                      <p className={`font-mono text-xs mt-1 ${step.active || step.done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 h-12 border border-border font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                Track Another Order
              </button>
              <a
                href="/contact"
                className="flex-1 h-12 flex items-center justify-center bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors"
              >
                Need Help? Contact Us
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
