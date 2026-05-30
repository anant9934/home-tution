"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, MessageSquare, Send, ShieldAlert, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  priority: string; // LOW, MEDIUM, HIGH
  createdAt: string;
}

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const loadTickets = async () => {
    try {
      const data = await fetchApi("/support/tickets");
      setTickets(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const newTicket = await fetchApi("/support/tickets", {
        method: "POST",
        body: JSON.stringify({ title, description, priority }),
      });
      setTickets((prev) => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      toast.success("Issue reported successfully. Our support team is on it!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-sky-500 hover:bg-sky-600 text-white gap-1"><AlertCircle className="w-3.5 h-3.5" /> Open</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1"><Clock className="w-3.5 h-3.5" /> In Progress</Badge>;
      case "RESOLVED":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</Badge>;
      case "CLOSED":
        return <Badge className="bg-slate-400 hover:bg-slate-500 text-white gap-1">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "HIGH":
        return "text-rose-500 bg-rose-500/10 border-rose-200";
      case "MEDIUM":
        return "text-amber-600 bg-amber-600/10 border-amber-200";
      default:
        return "text-emerald-600 bg-emerald-600/10 border-emerald-200";
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading">Support & Issue Tracking</h1>
        <p className="text-muted-foreground mt-1">Report learning hurdles, technical bugs, or billing issues and track them in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* REPORT ISSUE FORM */}
        <Card className="rounded-3xl border shadow-sm lg:col-span-5 h-fit">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Report a New Issue
            </CardTitle>
            <CardDescription>Tell us what went wrong. We usually respond within a few hours.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Issue Title</label>
                <Input
                  required
                  placeholder="e.g. Cannot view uploaded assignment"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Describe the Issue</label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Provide details of the problem. If applicable, mention the course, lesson, or quiz."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        priority === lvl
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-bold mt-4 rounded-xl gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* TICKET HISTORY */}
        <Card className="rounded-3xl border shadow-sm lg:col-span-7">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Support Ticket History
            </CardTitle>
            <CardDescription>View your reported issues and check their resolution status.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <ShieldAlert className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">Clean Record!</p>
                <p className="text-sm">You haven't reported any issues yet. You're good to go!</p>
              </div>
            ) : (
              <div className="divide-y overflow-hidden max-h-[600px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-slate-50/50 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-bold text-slate-800 leading-snug">{ticket.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 break-words leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-muted-foreground">
                      <span>Ticket ID: <span className="font-mono">{ticket.id.slice(0, 8)}...</span></span>
                      <span>Reported: {new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
