"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <span className="font-bold text-lg">K-Nomad</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              홈
            </Link>
            <Link
              href="/compare"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              비교
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="hidden md:block w-20 h-8" />
          ) : session?.user ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {session.user.nickname || session.user.name || session.user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="hidden md:inline-flex">
                  회원가입
                </Button>
              </Link>
            </>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
