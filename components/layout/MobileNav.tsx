"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { User } from "@supabase/supabase-js";

export default function MobileNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const nickname = user?.user_metadata?.nickname || user?.email;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          {user ? (
            <>
              <p className="text-sm text-muted-foreground py-2">{nickname}</p>
              <Button variant="ghost" size="sm" className="justify-start" onClick={handleSignOut}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">로그인</Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">회원가입</Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
