"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, BookOpen, MapPin, Wifi, Home, CheckCircle2, Loader2, CalendarDays, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const PLANS = [
  { label: "Basic", hours: 4, description: "Perfect for revision & doubt clearing" },
  { label: "Standard", hours: 8, description: "Ideal for regular weekly sessions" },
  { label: "Premium", hours: 12, description: "3 sessions/week — most popular" },
  { label: "Intensive", hours: 20, description: "Daily coaching & exam prep" },
];

export default function BookTutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.tutorId as string;

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // Default: Standard
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    fetchApi(`/tutors/public/${tutorId}`)
      .then(setTutor)
      .catch(() => toast.error("Failed to load tutor details"))
      .finally(() => setLoading(false));
  }, [tutorId]);

  const totalPrice = selectedPlan.hours * (tutor?.hourlyRate || 0);

  const handleBook = async () => {
    if (!tutor) return;
    setBooking(true);
    try {
      // Step 1: Create the booking (get bookingId + amount)
      const bookingData = await fetchApi("/bookings/monthly", {
        method: "POST",
        body: JSON.stringify({
          tutorId: tutor.id,
          hoursPerMonth: selectedPlan.hours,
          startDate,
        }),
      });

      // Step 2: Simulate payment (in production, open Razorpay here)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing

      // Step 3: Confirm payment → auto-assigns tutor
      const result = await fetchApi(`/bookings/${bookingData.bookingId}/confirm-payment`, {
        method: "POST",
        body: JSON.stringify({ paymentId: `sim_${Date.now()}` }),
      });

      setSuccess(result);
      toast.success("🎉 Tutor booked and assigned successfully!");
    } catch (err: any) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-60 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Tutor not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-primary font-semibold text-sm">
          ← Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold font-heading">You're all set! 🎉</h2>
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-semibold text-slate-800">{success.tutorName}</span> has been assigned as your tutor.
          Your {selectedPlan.label} plan ({selectedPlan.hours} hrs/month) starts on{" "}
          <span className="font-semibold text-slate-800">{new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
          ₹{totalPrice.toLocaleString("en-IN")} charged for {selectedPlan.hours} hours this month
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/student/book-tutor")}
            className="border border-slate-200 text-slate-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-slate-50 transition-colors"
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to tutors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tutor Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-3">
                {tutor.user?.name?.charAt(0) || "T"}
              </div>
              <h2 className="text-xl font-bold font-heading">{tutor.user?.name}</h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold">{tutor.rating?.toFixed(1) || "New"}</span>
                {tutor.totalReviews > 0 && (
                  <span className="text-xs text-muted-foreground">({tutor.totalReviews} reviews)</span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-primary" />
                <span>{tutor.experienceYears || 0} years experience</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                {tutor.teachingMode === "HOME" ? (
                  <Home className="w-4 h-4 text-amber-500" />
                ) : tutor.teachingMode === "ONLINE" ? (
                  <Wifi className="w-4 h-4 text-sky-500" />
                ) : (
                  <MapPin className="w-4 h-4 text-violet-500" />
                )}
                <span>{tutor.teachingMode || "Both modes"}</span>
              </div>
              {tutor.qualification && (
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{tutor.qualification}</span>
                </div>
              )}
            </div>

            {tutor.subjects?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subjects</div>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects.map((s: string) => (
                    <Badge key={s} variant="secondary" className="rounded-full text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {tutor.bio && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</div>
                <p className="text-sm text-slate-600 leading-relaxed">{tutor.bio}</p>
              </div>
            )}

            <div className="pt-3 border-t text-center">
              <div className="text-2xl font-bold text-primary">₹{tutor.hourlyRate}/hr</div>
              <div className="text-xs text-muted-foreground mt-0.5">Hourly rate</div>
            </div>
          </div>
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Plan Selection */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold font-heading text-lg mb-4">Choose Your Monthly Plan</h3>
            <div className="grid grid-cols-2 gap-3">
              {PLANS.map((plan) => {
                const price = plan.hours * (tutor.hourlyRate || 0);
                const isSelected = selectedPlan.label === plan.label;
                return (
                  <button
                    key={plan.label}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    {plan.label === "Premium" && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </div>
                    )}
                    <div className="font-bold text-slate-900">{plan.label}</div>
                    <div className="text-2xl font-bold text-primary mt-1">
                      {plan.hours}<span className="text-sm font-normal text-muted-foreground"> hrs/mo</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{plan.description}</div>
                    <div className="text-sm font-bold text-slate-800 mt-2">
                      ₹{price.toLocaleString("en-IN")}/month
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Date */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold font-heading text-lg mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" /> Start Date
            </h3>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold font-heading text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Tutor</span>
                <span className="font-semibold">{tutor.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Plan</span>
                <span className="font-semibold">{selectedPlan.label} ({selectedPlan.hours} hrs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rate</span>
                <span className="font-semibold">₹{tutor.hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Start Date</span>
                <span className="font-semibold">
                  {new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold">
                <span>Total This Month</span>
                <span className="text-primary text-xl">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <IndianRupee className="w-5 h-5" />
                  Pay ₹{totalPrice.toLocaleString("en-IN")} & Book Tutor
                </>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              🔒 Secure payment · Tutor auto-assigned on success · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
