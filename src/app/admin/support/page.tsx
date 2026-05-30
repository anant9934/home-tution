"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Ticket,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface UserDetails {
  name: string;
  email: string;
  role: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  priority: string; // LOW, MEDIUM, HIGH
  createdAt: string;
  user: UserDetails;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/support/admin/tickets");
      setTickets(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch admin support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setUpdatingId(ticketId);
    try {
      await fetchApi(`/support/admin/tickets/${ticketId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      toast.success("Ticket status updated successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update ticket status");
    } finally {
      setUpdatingId(null);
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

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case "HIGH":
        return <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600 font-bold">High</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-600 font-bold">Medium</Badge>;
      default:
        return <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-600 font-bold">Low</Badge>;
    }
  };

  // Filter and Search tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Support Ticket Hub</h1>
          <p className="text-muted-foreground mt-1">Manage, investigate, and resolve issues reported by students, parents, and tutors.</p>
        </div>
        <Button onClick={loadTickets} variant="outline" className="rounded-full gap-2 self-start sm:self-auto shadow-sm">
          <RefreshCw className="w-4 h-4" /> Refresh Tickets
        </Button>
      </div>

      {/* FILTER CONTROLS */}
      <Card className="rounded-3xl border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by user, ticket title, details..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus-visible:ring-primary h-10"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="md:col-span-3">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TICKETS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-3xl" />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <Card className="rounded-3xl border shadow-sm p-12 text-center text-muted-foreground">
            <Ticket className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="font-bold text-foreground text-lg mb-1">No Tickets Found</h3>
            <p className="text-sm">Try relaxing your search query or filters.</p>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="rounded-3xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Header */}
              <div className="p-6 bg-slate-50/50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-bold text-slate-800">{ticket.user.name}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{ticket.user.email}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <Badge variant="secondary" className="text-[10px] w-fit font-bold uppercase tracking-wider bg-slate-200">
                    {ticket.user.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Body */}
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{ticket.title}</h3>
                      <div className="flex gap-1.5">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 break-words leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Ticket ID: {ticket.id}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:col-span-4 lg:border-l lg:pl-6 space-y-3 shrink-0">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Update Ticket Status</label>
                    <div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-2">
                      {[
                        { label: "Open", value: "OPEN", color: "bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100" },
                        { label: "In Progress", value: "IN_PROGRESS", color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" },
                        { label: "Resolved", value: "RESOLVED", color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" },
                        { label: "Close", value: "CLOSED", color: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" },
                      ].map((statusBtn) => (
                        <Button
                          key={statusBtn.value}
                          variant="outline"
                          size="sm"
                          disabled={updatingId === ticket.id || ticket.status === statusBtn.value}
                          onClick={() => handleStatusChange(ticket.id, statusBtn.value)}
                          className={`rounded-xl text-xs font-semibold px-3 py-1.5 h-auto transition-all ${
                            ticket.status === statusBtn.value
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm disabled:opacity-100"
                              : statusBtn.color
                          }`}
                        >
                          {statusBtn.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
