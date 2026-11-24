"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, type ReactNode } from "react";
import { AuthReadyContext } from "../app/providers";
import { useAuthStore } from "../stores/auth-store";

export function AuthGate({ children, guestOnly = false }: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const router = useRouter();
  const authReady = useContext(AuthReadyContext);
  const accessToken = useAuthStore((state) => state.accessToken);
  const destination = guestOnly
    ? (accessToken ? "/" : null)
    : (accessToken ? null : "/login");

  useEffect(() => {
    if (authReady && destination) router.replace(destination);
  }, [authReady, destination, router]);

  return authReady && !destination ? children : null;
}
