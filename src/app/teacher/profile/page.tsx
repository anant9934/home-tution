"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { User, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchApi("/tutors/profile");
        setProfile(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name" || name === "phone" || name === "email") {
       setProfile({ ...profile, user: { ...profile.user, [name]: value } });
    } else {
       setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi("/tutors/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: profile.user.name,
          phone: profile.user.phone,
          bio: profile.bio,
          experienceYears: profile.experienceYears,
          qualification: profile.qualification,
          hourlyRate: profile.hourlyRate,
          subjects: profile.subjects,
          teachingMode: profile.teachingMode,
          introVideoUrl: profile.introVideoUrl
        })
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <User className="w-8 h-8 text-primary" /> Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your public profile and teaching preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-full shadow-sm gap-2 font-bold px-8">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="p-8 border-b bg-slate-50 flex items-center gap-6">
            <div className="relative group">
               <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.user?.name}`} />
                  <AvatarFallback>TP</AvatarFallback>
               </Avatar>
               <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4" />
               </button>
            </div>
            <div>
               <h2 className="text-xl font-bold font-heading">{profile?.user?.name}</h2>
               <p className="text-muted-foreground text-sm">{profile?.user?.email}</p>
            </div>
         </div>

         <div className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input name="name" value={profile?.user?.name || ""} onChange={handleChange} className="bg-slate-50" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Phone Number</label>
                  <Input name="phone" value={profile?.user?.phone || ""} onChange={handleChange} className="bg-slate-50" />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">Professional Bio</label>
                  <Textarea 
                     name="bio" 
                     value={profile?.bio || ""} 
                     onChange={handleChange} 
                     className="bg-slate-50 min-h-[120px]" 
                     placeholder="Tell students about yourself..."
                  />
               </div>
            </div>

            <hr />

            {/* Teaching Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Highest Qualification</label>
                  <Input name="qualification" value={profile?.qualification || ""} onChange={handleChange} className="bg-slate-50" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Experience (Years)</label>
                  <Input type="number" name="experienceYears" value={profile?.experienceYears || 0} onChange={handleChange} className="bg-slate-50" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Subjects (comma separated)</label>
                  <Input 
                     name="subjects" 
                     value={Array.isArray(profile?.subjects) ? profile.subjects.join(", ") : profile?.subjects || ""} 
                     onChange={handleChange} 
                     className="bg-slate-50" 
                     placeholder="e.g. Mathematics, Physics"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Hourly Rate (₹)</label>
                  <Input type="number" name="hourlyRate" value={profile?.hourlyRate || 0} onChange={handleChange} className="bg-slate-50" />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">Introductory Video URL (YouTube)</label>
                  <Input name="introVideoUrl" value={profile?.introVideoUrl || ""} onChange={handleChange} className="bg-slate-50" placeholder="https://youtube.com/..." />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
