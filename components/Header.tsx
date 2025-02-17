"use client";

// React/Next
import React from "react";
import Link from "next/link";
import Image from "next/image";

// UI
import LoginButton from "./LoginLogoutButton";

const Header = () => {
  return (
    <header className="hidden md:block p-4">
      <nav className="container mx-auto flex items-center justify-between rounded-lg shadow-lg px-6 py-3">
        <div className="flex flex-none w-1/6 items-center">
          <Link href="/">
            <Image
              src="/icons/logo.svg"
              width={30}
              height={30}
              alt="menu item"
            />
          </Link>
        </div>
        <div className="flex-1 w-4/6">
          <div className="flex justify-center items-center w-full gap-12">
            <Link href="/" className="text-xl font-normal hover:text-primary">
              Home
            </Link>
            <Link
              className="text-xl font-normal hover:text-primary"
              href="/campgrounds"
            >
              Campgrounds
            </Link>
            <Link
              className="text-xl font-normal hover:text-primary"
              href="/campgrounds/new"
            >
              Create Campground
            </Link>
            <Link
              className="text-xl font-normal hover:text-primary"
              href="/contact"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="flex w-1/6 justify-end flex-none">
          <LoginButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
