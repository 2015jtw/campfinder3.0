import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { name: "Campgrounds", href: "/campgrounds" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const Header = ({ className }: { className?: string }) => {
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
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
