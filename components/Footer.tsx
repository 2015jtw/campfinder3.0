import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">CampFinder</h3>
            <p className="text-sm text-muted-foreground">
              Discover and share the best camping spots around the world. Your
              next adventure awaits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Campgrounds
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Create Campground
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Social and Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Connect With Us</h3>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Image
                  src="/icons/github.svg"
                  className="h-5 w-5"
                  alt="Github icon"
                  width={28}
                  height={28}
                />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Image
                  src="/icons/inBug-Black.png"
                  className="h-5 w-5"
                  alt="Linkedin icon"
                  width={28}
                  height={28}
                />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="mailto:joshuafreelance96@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-w-7 w-7 text-black" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CampSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
