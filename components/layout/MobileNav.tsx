"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>🏠</span> K-Nomad
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 mt-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-sm hover:text-foreground transition-colors py-2"
          >
            🏠 홈
          </Link>
          <Link
            href="/compare"
            onClick={() => setOpen(false)}
            className="text-sm hover:text-foreground transition-colors py-2"
          >
            🔄 도시 비교
          </Link>
          <Link
            href="/programs"
            onClick={() => setOpen(false)}
            className="text-sm hover:text-foreground transition-colors py-2"
          >
            📢 워케이션 프로그램
          </Link>
          <Separator />
          {session?.user ? (
            <>
              <p className="text-sm text-muted-foreground py-2">
                {session.user.nickname || session.user.name || session.user.email}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setOpen(false);
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  로그인
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">회원가입</Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
