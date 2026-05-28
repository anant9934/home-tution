import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
      <div className="md:hidden flex items-center gap-2 mb-2">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold font-heading">Aura</span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Create an account</h1>
        <p className="text-muted-foreground">Select your role and enter your details to get started.</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1 h-auto bg-muted rounded-xl mb-6">
          <TabsTrigger value="student" className="rounded-lg py-2">Student</TabsTrigger>
          <TabsTrigger value="parent" className="rounded-lg py-2">Parent</TabsTrigger>
          <TabsTrigger value="tutor" className="rounded-lg py-2">Tutor</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">First Name</label>
               <Input placeholder="John" className="h-12 rounded-xl" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Last Name</label>
               <Input placeholder="Doe" className="h-12 rounded-xl" />
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="hello@example.com" className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Create a strong password" className="h-12 rounded-xl" />
          </div>
          
          <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-md mt-4">
            Create Account
          </Button>
        </div>
      </Tabs>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
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
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
