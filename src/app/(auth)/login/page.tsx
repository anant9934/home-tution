import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input type="email" placeholder="hello@example.com" className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium">Password</label>
             <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
        </div>
        
        <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-md mt-2">
          Log in
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-12 rounded-xl bg-background">
           Google
        </Button>
        <Button variant="outline" className="h-12 rounded-xl bg-background">
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
