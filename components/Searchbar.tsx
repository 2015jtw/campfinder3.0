"use client";

// React/Next/utils
import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// UI
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  className?: string;
}

const Searchbar = ({ onSearch, className }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campgrounds..."
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
};

export default Searchbar;
