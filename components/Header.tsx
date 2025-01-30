import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/supabaseClient";
const Header = async ({ className }: { className?: string }) => {
  const user = await currentUser();

  if (user) {
    try {
      // Check if user already exists in Supabase
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (!existingUser) {
        // Create new user in Supabase
        const { error } = await supabase.from("users").insert({
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
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
  }

  return (
    <header className="p-4 border-b border-black shadow-md hidden md:flex">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu item" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="gap-4 flex items-center">
            <Link
              href="/"
              className={cn("text-18 font-bold text-white-1", className)}
            >
              Home
            </Link>
            <Link href="/campgrounds">See Campgrounds</Link>
            <Link href="/campgrounds/new">Create Campground</Link>
            {user ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              <>
                <Link href="/sign-in">Sign In</Link>
                <Link href="/sign-up">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
