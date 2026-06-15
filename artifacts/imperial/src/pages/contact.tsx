import { Layout } from "@/components/layout";
import { useState } from "react";
import { MessageCircle, Mail, Instagram, Send } from "lucide-react";

const WHATSAPP_NUMBER = "639XXXXXXXXX";
const EMAIL_ADDRESS = "hello@imperial-clothing.com";
const INSTAGRAM_HANDLE = "imperialclothing";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi Imperial! I'm interested in your collection.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Contact</h1>
          <p className="mt-4 font-mono text-sm text-muted-foreground max-w-md uppercase tracking-widest leading-relaxed">
            Questions, orders, collabs — we respond fast.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className="border border-border bg-card p-6 flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Fastest Response</span>
              <h2 className="font-serif text-2xl font-bold">WhatsApp</h2>
              <p className="font-mono text-sm text-muted-foreground mt-1">
                Message us directly for order inquiries, sizing questions, or custom requests.
              </p>
              <button
                onClick={handleWhatsApp}
                className="mt-4 flex items-center justify-center gap-3 w-full h-14 bg-[#25D366] hover:bg-[#20bc59] text-white font-mono text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </button>
            </div>

            <div className="border border-border bg-card p-6 flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Social</span>
              <h2 className="font-serif text-2xl font-bold">Instagram</h2>
              <p className="font-mono text-sm text-muted-foreground mt-1">
                Follow us for new drops, restocks, and behind-the-scenes content.
              </p>
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-3 w-full h-14 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-mono text-sm font-bold uppercase tracking-widest transition-opacity"
              >
                <Instagram className="w-5 h-5" />
                @{INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          <div className="border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Send a Message</span>
            </div>

            {sent ? (
              <div className="py-12 text-center">
                <Send className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-serif text-xl font-bold">Message Sent</h3>
                <p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                  We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your order, size, or inquiry..."
                    className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
