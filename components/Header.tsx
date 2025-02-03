"use client";

// React/Next
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// UI + utils
import { cn } from "@/lib/utils";
import LoginButton from "./LoginLogoutButton";

const Header = () => {
  const pathname = usePathname();

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
              className={cn("text-lg font-medium", {
                "text-blue-600": pathname === "/",
              })}
            >
              Home
            </Link>
            <Link
              className={cn("text-lg font-medium", {
                "text-blue-600": pathname === "/campgrounds",
              })}
              href="/campgrounds"
            >
              Campgrounds
            </Link>
            <Link
              className={cn("text-lg font-medium", {
                "text-blue-600": pathname === "/campgrounds/new",
              })}
              href="/campgrounds/new"
            >
              New Campground
            </Link>
          </div>
        </div>
        <div>
          <LoginButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
