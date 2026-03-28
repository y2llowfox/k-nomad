import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold">K-Nomad</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            © 2026 K-Nomad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
