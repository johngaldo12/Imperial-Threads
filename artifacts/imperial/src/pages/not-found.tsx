import { Layout } from "@/components/layout";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-background">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter uppercase text-foreground">
            404
          </h1>
          <p className="mt-6 text-lg font-mono text-muted-foreground uppercase tracking-widest max-w-md mx-auto">
            This page does not exist. The silence here is absolute.
          </p>
          <div className="mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-mono tracking-widest font-bold uppercase border border-border text-foreground hover:bg-muted transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
