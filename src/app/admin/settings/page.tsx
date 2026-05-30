"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Settings, Save, Shield, Mail, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchApi("/admin/settings");
        setSettings(data);
      } catch (err: any) {
        toast.error("Failed to load configuration");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
     setSaving(true);
     // Simulate API call to save settings
     setTimeout(() => {
        setSaving(false);
        toast.success("Global settings saved successfully!");
     }, 1000);
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
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" /> Platform Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure global application variables and limits.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-full shadow-sm gap-2 font-bold px-8">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="p-8 border-b bg-slate-50">
            <h2 className="font-bold font-heading text-lg flex items-center gap-2">
               <Shield className="w-5 h-5 text-muted-foreground" /> Security & Access
            </h2>
         </div>
         <div className="p-8 space-y-6 border-b">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="font-semibold text-sm">Allow New Registrations</h3>
                  <p className="text-xs text-muted-foreground mt-1">When disabled, no new students or tutors can sign up.</p>
               </div>
               <Switch checked={settings?.allowNewRegistrations} onCheckedChange={(val) => setSettings({...settings, allowNewRegistrations: val})} />
            </div>
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="font-semibold text-sm">Maintenance Mode</h3>
                  <p className="text-xs text-muted-foreground mt-1">Display a maintenance screen to all non-admin users.</p>
               </div>
               <Switch checked={settings?.maintenanceMode} onCheckedChange={(val) => setSettings({...settings, maintenanceMode: val})} />
            </div>
         </div>

         <div className="p-8 border-b bg-slate-50">
            <h2 className="font-bold font-heading text-lg flex items-center gap-2">
               <Globe className="w-5 h-5 text-muted-foreground" /> Platform Variables
            </h2>
         </div>
         <div className="p-8 space-y-6 border-b">
            <div className="space-y-2">
               <label className="text-sm font-semibold">Platform Fee Percentage (%)</label>
               <Input 
                  type="number" 
                  value={settings?.platformFeePercentage || 0} 
                  onChange={(e) => setSettings({...settings, platformFeePercentage: parseFloat(e.target.value)})}
                  className="bg-slate-50 max-w-xs" 
               />
               <p className="text-xs text-muted-foreground">The cut taken from every tutor transaction.</p>
            </div>
         </div>

         <div className="p-8 border-b bg-slate-50">
            <h2 className="font-bold font-heading text-lg flex items-center gap-2">
               <Mail className="w-5 h-5 text-muted-foreground" /> Communications
            </h2>
         </div>
         <div className="p-8 space-y-6">
            <div className="space-y-2">
               <label className="text-sm font-semibold">Support Contact Email</label>
               <Input 
                  value={settings?.contactEmail || ""} 
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  className="bg-slate-50 max-w-md" 
               />
               <p className="text-xs text-muted-foreground">Used as the sender address for automated emails.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
