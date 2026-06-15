import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleFacebook = () => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!appId) {
      alert("Facebook login is being set up. Try email sign-in for now.");
      return;
    }
    const redirect = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent("public_profile,email");
    window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${redirect}&scope=${scope}&response_type=token`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-background border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-tight">
            {mode === "login" ? "Sign In" : "Register"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center">
              <User className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-xl font-bold">
                {mode === "register" ? "Account Created!" : "Welcome Back!"}
              </h3>
              <p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                {mode === "register" ? "You're now part of the Imperial family." : "You've been signed in."}
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full h-12 bg-primary text-primary-foreground font-mono text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleFacebook}
                className="w-full h-12 flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-mono text-sm font-bold uppercase tracking-widest transition-colors mb-5"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === "register" && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      placeholder="Full name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-card border border-border pl-11 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-card border border-border pl-11 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-card border border-border pl-11 pr-12 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-primary-foreground font-mono text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors mt-1"
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setMode(m => m === "login" ? "register" : "login")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest underline underline-offset-4"
                >
                  {mode === "login" ? "No account? Register" : "Already have one? Sign in"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
