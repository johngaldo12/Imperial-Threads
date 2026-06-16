import { Link, useLocation } from "wouter";
import { useLocalCart } from "@/hooks/use-local-cart";
import { useAuth } from "@/contexts/auth-context";
import { ShoppingBag, User, LogOut } from "lucide-react";
import logo from "@assets/logo_1781537346154.jpg";
import { useState } from "react";
import { AuthModal } from "@/components/auth-modal";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { cart } = useLocalCart();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const totalItems = cart?.totalQuantity || 0;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <img src={logo} alt="Imperial" className="h-10 w-10 object-contain" />
            </Link>
            <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-mono tracking-wider">
              <Link href="/shop" className={`transition-colors hover:text-foreground ${location === '/shop' ? 'text-foreground' : 'text-muted-foreground'}`}>
                SHOP
              </Link>
              <Link href="/contact" className={`transition-colors hover:text-foreground ${location === '/contact' ? 'text-foreground' : 'text-muted-foreground'}`}>
                CONTACT
              </Link>
              <Link href="/track" className={`transition-colors hover:text-foreground ${location === '/track' ? 'text-foreground' : 'text-muted-foreground'}`}>
                TRACK ORDER
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Welcome: <span className="text-foreground font-bold">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
            <Link href="/cart" className="relative group flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-muted">
              <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
                <img src={logo} alt="Imperial" className="h-12 w-12 object-contain" />
                <span className="text-2xl font-serif tracking-tighter uppercase font-bold text-foreground">Imperial</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm font-mono">
                Premium streetwear for those who dress with intention. The silence is deliberate.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold uppercase tracking-widest mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold uppercase tracking-widest mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground font-mono flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Imperial. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
