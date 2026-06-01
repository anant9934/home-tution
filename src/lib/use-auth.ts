"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";

/**
 * Hook that returns the authenticated user and guards the route.
 * If the user is not authenticated or has the wrong role, redirect to /login.
 */
export function useAuth(requiredRole?: string | string[]) {
  const { user, loading, error, logout, refreshUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        // Redirect to the correct dashboard based on role
        const roleRoutes: Record<string, string> = {
          SUPER_ADMIN: "/admin/dashboard",
          ADMIN: "/admin/dashboard",
          TUTOR: "/teacher/dashboard",
          STUDENT: "/student/dashboard",
          PARENT: "/parent/dashboard",
        };
        router.replace(roleRoutes[user.role] || "/auth/login");
      }
    }
  }, [user, loading, requiredRole, router]);

  const getInitials = () => {
    if (!user?.name) return "??";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return {
    user,
    loading,
    error,
    logout,
    refreshUser,
    getInitials,
    getGreeting,
    isAuthenticated: !!user,
  };
}
