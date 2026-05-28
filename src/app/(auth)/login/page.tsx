"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Real Login Logic
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store JWT token (in a real app, use httpOnly cookies)
      document.cookie = `token=${data.access_token}; path=/; max-age=86400`;

      toast.success("Login successful!");
      
      const role = data.user.role;
      let redirectUrl = "/";
      
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        redirectUrl = "/admin/dashboard";
      } else if (role === "TUTOR") {
        redirectUrl = "/teacher/dashboard";
      } else if (role === "STUDENT") {
        redirectUrl = "/student/dashboard";
      } else if (role === "PARENT") {
        redirectUrl = "/parent/dashboard";
      } else {
        redirectUrl = "/student/dashboard";
      }

      router.push(redirectUrl);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="md:hidden flex items-center gap-2 mb-4">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold font-heading">Aura</span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input 
            type="email" 
            placeholder="hello@example.com" 
            className="h-12 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium">Password</label>
             <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input 
            type="password" 
            placeholder="••••••••" 
            className="h-12 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 rounded-xl text-base font-semibold shadow-md mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" className="h-12 rounded-xl bg-background">
           Google
        </Button>
        <Button type="button" variant="outline" className="h-12 rounded-xl bg-background">
           Apple
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
