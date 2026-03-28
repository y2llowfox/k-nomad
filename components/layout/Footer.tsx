import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold">K-Nomad</span>
            <span className="text-sm text-muted-foreground">
              대한민국 디지털 노마드 도시 가이드
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/contact" className="hover:text-foreground transition-colors">
              문의하기
            </Link>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-center text-xs text-muted-foreground">
          © 2026 K-Nomad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
