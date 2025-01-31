"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/"), 1000);
  }, []);
  return <div>You have logged out... redirecting in a second.</div>;
};

export default LogoutPage;
