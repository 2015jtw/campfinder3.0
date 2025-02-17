"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

const LoginButton = ({ className }: { className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Button
        onClick={() => {
          signout();
          setUser(null);
        }}
        className={cn(className)}
      >
        Log out
      </Button>
    );
  }
  return (
    <Button
      onClick={() => {
        router.push("/login");
      }}
      className={cn(className)}
    >
      Login
    </Button>
  );
};

export default LoginButton;
