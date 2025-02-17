"use client";

// React/Next
import React from "react";
import Image from "next/image";
import Link from "next/link";

// UI
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoginButton from "./LoginLogoutButton";

const baseLinks = [
  { name: "Home", href: "/" },
  { name: "Campgrounds", href: "/campgrounds" },
  { name: "New Campground", href: "/campgrounds/new" },
  { name: "Contact Us", href: "/contact" },
];

const MobileHeader = () => {
  return (
    <header className="flex h-16 md:hidden">
      <nav className="flex items-center justify-between container mx-auto px-5">
        <Image src="/icons/logo.svg" width={30} height={30} alt="menu item" />

        <Sheet>
          <SheetTrigger>
            <Link href="/">
              <Image
                src="/icons/hamburger.svg"
                width={30}
                height={30}
                alt="Menu"
                className="cursor-pointer"
              />
            </Link>
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
            {baseLinks.map((link) => (
              <SheetClose asChild key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center gap-4 text-white-1 text-18 font-medium py-4 pl-4 hover:text-primary"
                >
                  {link.name}
                </Link>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <LoginButton className="ml-4 my-4" />
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default MobileHeader;
