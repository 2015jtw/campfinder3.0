"use client";

// React/Next
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// UI
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

// supabase + clerk
import { useUser, SignedIn, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/supabaseClient";

const getLinks = (isSignedIn: boolean) => {
  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "Campgrounds", href: "/campgrounds" },
  ];

  const authLinks = isSignedIn
    ? [] // When signed in, we'll show the UserButton instead
    : [
        { name: "Sign In", href: "/sign-in" },
        { name: "Sign Up", href: "/sign-up" },
      ];

  return [...baseLinks, ...authLinks];
};

const MobileHeader = () => {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (!user) return;

      try {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (!existingUser) {
          // Create new user in Supabase
          const { error } = await supabase.from("users").insert({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.imageUrl,
            created_at: new Date().toISOString(),
          });

          if (error) {
            console.error("Error creating user in Supabase:", error);
          }
        }
      } catch (error) {
        console.error("Error syncing user with Supabase:", error);
      }
    };

    syncUserWithSupabase();
  }, [user]);

  const sidebarLinks = getLinks(!!isSignedIn);

  return (
    <header className="flex h-16 md:hidden">
      <nav className="flex items-center justify-between container mx-auto px-5">
        <Image src="/icons/logo.svg" width={30} height={30} alt="menu item" />

        {isSignedIn && (
          <div className="pl-4 pt-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        )}

        <Sheet>
          <SheetTrigger>
            <Image
              src="/icons/hamburger.svg"
              width={30}
              height={30}
              alt="Menu"
              className="cursor-pointer"
            />
          </SheetTrigger>
          <SheetContent side="right">
            <DialogTitle className="hidden">Navigation Menu</DialogTitle>
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
            >
              <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
              <h1 className="text-24 font-extrabold text-white-1 ml-2">
                CampFinder 3.0
              </h1>
            </Link>
            {sidebarLinks.map((link) => (
              <SheetClose asChild key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 text-white-1 text-18 font-medium py-4 pl-4",
                    {
                      "text-blue-600": pathname === link.href,
                    }
                  )}
                >
                  {link.name}
                </Link>
              </SheetClose>
            ))}
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default MobileHeader;
