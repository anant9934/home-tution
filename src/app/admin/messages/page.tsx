"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { fetchApi } from "@/lib/api";
import { Megaphone, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminMessagesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState<string>("ALL");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    // We can fetch the current user profile, or just use the token decoding
    // For now, we'll fetch profile or assume an admin ID if available.
    fetchApi("/users/profile").then(res => setCurrentUser(res)).catch(() => {
       // fallback if /users/profile isn't available for admin
       setCurrentUser({ id: 'admin-123', role: 'ADMIN' }); 
    });
  }, []);

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return toast.error("Message cannot be empty");
    setSendingBroadcast(true);
    try {
      const res = await fetchApi("/messages/broadcast", {
        method: "POST",
        body: JSON.stringify({ targetGroup: broadcastTarget, messageText: broadcastMessage })
      });
      toast.success(`Broadcast sent to ${res.count} users!`);
      setBroadcastMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send broadcast");
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Communication Center</h1>
          <p className="text-muted-foreground mt-1">Manage all platform messages and announcements</p>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="inbox" className="px-6">Direct Inbox</TabsTrigger>
          <TabsTrigger value="broadcast" className="px-6 flex items-center gap-2"><Megaphone className="w-4 h-4" /> Global Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          {currentUser && (
            <ChatInterface currentUserId={currentUser.id} currentUserRole={currentUser.role} />
          )}
        </TabsContent>

        <TabsContent value="broadcast">
          <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold mb-2">Send Announcement</h2>
            <p className="text-muted-foreground mb-6 text-sm">Send a direct message to all users in a specific role. They will receive it as a direct message from the Admin.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <Select value={broadcastTarget} onValueChange={(val) => setBroadcastTarget(val || "ALL")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users (Tutors, Students, Parents)</SelectItem>
                    <SelectItem value="TUTORS">Only Tutors</SelectItem>
                    <SelectItem value="STUDENTS">Only Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type your important announcement here..." 
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button 
                onClick={handleBroadcast} 
                disabled={sendingBroadcast || !broadcastMessage.trim()}
                className="w-full rounded-full flex items-center gap-2"
              >
                {sendingBroadcast ? "Sending..." : "Send Broadcast"} <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
