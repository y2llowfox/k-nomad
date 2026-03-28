"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const nickname = user?.user_metadata?.nickname || user?.email;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <span className="font-bold text-lg">K-Nomad</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="hidden md:block w-20 h-8" />
          ) : user ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {nickname}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                onClick={handleSignOut}
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
              <Link href="/register">
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
