"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type SessionStatusProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const SessionStatus = ({ children, fallback = null }: SessionStatusProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session;

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}; 