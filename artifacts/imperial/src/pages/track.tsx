import { Layout } from "@/components/layout";
import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

type OrderStatus = "processing" | "shipped" | "out_for_delivery" | "delivered" | "not_found";

interface TrackingStep {
  label: string;
  description: string;
  date: string;
  done: boolean;
  active: boolean;
}

const DEMO_ORDERS: Record<string, { status: OrderStatus; item: string; steps: TrackingStep[] }> = {
  "IMP-00123": {
    status: "shipped",
    item: "Imperial Anubis Tee — Black (M)",
    steps: [
      { label: "Order Placed", description: "Your order was received and confirmed.", date: "Jun 10, 2026", done: true, active: false },
      { label: "Processing", description: "Your item is being prepared and packed.", date: "Jun 11, 2026", done: true, active: false },
      { label: "Shipped", description: "Your order is on its way.", date: "Jun 13, 2026", done: true, active: true },
      { label: "Out for Delivery", description: "Package is with the delivery courier.", date: "—", done: false, active: false },
      { label: "Delivered", description: "Package delivered to your address.", date: "—", done: false, active: false },
    ],
  },
  "IMP-00456": {
    status: "delivered",
    item: "Imperial Anubis Shorts — Cream (L)",
    steps: [
      { label: "Order Placed", description: "Your order was received and confirmed.", date: "Jun 5, 2026", done: true, active: false },
      { label: "Processing", description: "Your item is being prepared and packed.", date: "Jun 6, 2026", done: true, active: false },
      { label: "Shipped", description: "Your order is on its way.", date: "Jun 8, 2026", done: true, active: false },
      { label: "Out for Delivery", description: "Package is with the delivery courier.", date: "Jun 9, 2026", done: true, active: false },
      { label: "Delivered", description: "Package delivered to your address.", date: "Jun 9, 2026", done: true, active: true },
    ],
  },
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  processing: "text-yellow-400",
  shipped: "text-blue-400",
  out_for_delivery: "text-orange-400",
  delivered: "text-green-400",
  not_found: "text-red-400",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  not_found: "Not Found",
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  processing: <Clock className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  out_for_delivery: <Truck className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
  not_found: <AlertCircle className="w-5 h-5" />,
};

export default function Track() {
  const [form, setForm] = useState({ email: "", orderNumber: "" });
  const [result, setResult] = useState<null | { status: OrderStatus; item?: string; steps?: TrackingStep[] }>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = DEMO_ORDERS[form.orderNumber.toUpperCase().trim()];
    if (order) {
      setResult(order);
    } else {
      setResult({ status: "not_found" });
    }
    setSearched(true);
  };

  const handleReset = () => {
    setResult(null);
    setSearched(false);
    setForm({ email: "", orderNumber: "" });
  };

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
              className="w-full h-14 bg-primary text-primary-foreground font-mono text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-1"
            >
              <Search className="w-4 h-4" />
              Track My Order
            </button>

            <p className="font-mono text-xs text-muted-foreground text-center uppercase tracking-wider">
              Order number is in your confirmation email &mdash; starts with IMP-
            </p>
          </form>
        ) : result?.status === "not_found" ? (
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
                  <p className="font-mono text-sm font-bold">{form.orderNumber.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">Item</p>
                  <p className="font-mono text-sm">{result.item}</p>
                </div>
                <div className={`flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest ${STATUS_COLORS[result.status]}`}>
                  {STATUS_ICONS[result.status]}
                  {STATUS_LABELS[result.status]}
                </div>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold mb-8 uppercase">Delivery Timeline</h2>
              <div className="relative flex flex-col gap-0">
                {result.steps?.map((step, i) => (
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
                      {i < (result.steps?.length ?? 0) - 1 && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[2rem] ${step.done ? "bg-muted-foreground/50" : "bg-border"}`} />
                      )}
                    </div>
                    <div className={`pb-8 ${i === (result.steps?.length ?? 0) - 1 ? "pb-0" : ""}`}>
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
