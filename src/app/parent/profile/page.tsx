"use client";

import { useState, useEffect } from "react";
import { User, Save, AlertCircle, Loader2, Mail, Phone, Briefcase, MapPin, GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  occupation: string | null;
  address: string | null;
  children: { id: string; name: string; class: string; board: string; schoolName: string | null }[];
}

export default function ProfilePage() {
  const { logout } = useAuth("PARENT");
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchApi("/parents/profile")
      .then((result) => {
        setData(result);
        setEditName(result.name || "");
        setEditPhone(result.phone || "");
        setEditOccupation(result.occupation || "");
        setEditAddress(result.address || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await fetchApi("/parents/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          occupation: editOccupation,
          address: editAddress,
        }),
      });
      setData(result);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const initials = data.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <div className="space-y-8 pb-20 lg:pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={data.avatarUrl || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold font-heading">{data.name}</h2>
              <p className="text-muted-foreground mt-1">{data.email}</p>
              <Badge variant="outline" className="mt-2 border-primary/30 text-primary">Parent Account</Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Display / Edit Form */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-11 rounded-xl" placeholder="+91..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><Briefcase className="w-4 h-4" /> Occupation</label>
                <Input value={editOccupation} onChange={(e) => setEditOccupation(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</label>
                <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: data.email },
                { icon: Phone, label: "Phone", value: data.phone || "Not set" },
                { icon: Briefcase, label: "Occupation", value: data.occupation || "Not set" },
                { icon: MapPin, label: "Address", value: data.address || "Not set" },
              ].map((field, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <field.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{field.label}</p>
                    <p className="text-sm font-semibold">{field.value}</p>
                  </div>
                </div>
              ))}
              <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full rounded-xl mt-4">
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" /> Linked Children
        </h3>
        {data.children.length > 0 ? (
          <div className="space-y-3">
            {data.children.map((child) => (
              <div key={child.id} className="flex items-center gap-4 p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {child.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{child.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Class {child.class} • {child.board}
                    {child.schoolName && ` • ${child.schoolName}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">No children linked to your account.</p>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="font-bold font-heading mb-4">Account</h3>
        <Button
          variant="outline"
          onClick={logout}
          className="w-full rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
