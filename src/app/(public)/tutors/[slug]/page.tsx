"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, CheckCircle2, GraduationCap, Video, BookOpen, Clock, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_TUTORS } from "@/lib/mock-data";

export default function TutorProfilePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const tutor = MOCK_TUTORS.find(t => t.id === params.slug) || MOCK_TUTORS[0];
  
  const [bookingStep, setBookingStep] = useState<"IDLE" | "MODAL" | "SUCCESS">("IDLE");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const slots = [
    "Tomorrow, 4:00 PM - 5:00 PM",
    "Tomorrow, 6:30 PM - 7:30 PM",
    "Thursday, 5:00 PM - 6:00 PM",
    "Saturday, 10:00 AM - 11:00 AM",
  ];

  const handleBookDemo = () => {
    setBookingStep("SUCCESS");
    setTimeout(() => {
       router.push("/student/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* BACKGROUND HEADER */}
      <div className="h-64 bg-primary/5 w-full absolute top-0 inset-x-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(248,250,252,1)_100%)]"></div>
      </div>

      <main className="container mx-auto px-4 md:px-6 pt-32 relative z-10">
         
         <Link href="/tutors" className="text-sm font-medium text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Back to Tutors
         </Link>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* PROFILE HEADER */}
               <div className="bg-white p-8 rounded-3xl shadow-sm border">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                     <img src={tutor.image} alt={tutor.name} className="w-32 h-32 rounded-3xl bg-muted object-cover" />
                     <div className="flex-1">
                        <h1 className="text-3xl font-bold font-heading flex items-center gap-3 mb-2">
                          {tutor.name}
                          {tutor.isVerified && <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20"><ShieldCheck className="w-4 h-4 mr-1"/> Verified</Badge>}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-4">{tutor.qualification}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground mb-6">
                           <div className="flex items-center gap-1.5 font-medium text-foreground">
                             <Star className="w-4 h-4 text-warning fill-warning" /> {tutor.rating} <span className="font-normal text-muted-foreground">({tutor.reviews} reviews)</span>
                           </div>
                           <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {tutor.experience}</div>
                           <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {tutor.location}</div>
                        </div>

                        <div className="flex gap-2">
                           {tutor.subjects.map((sub, i) => (
                             <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20">{sub}</Badge>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* TABS (Static visual) */}
               <div className="flex gap-2 p-1.5 bg-muted/50 rounded-full w-fit">
                  <div className="px-6 py-2 rounded-full bg-white shadow-sm text-sm font-bold">About</div>
                  <div className="px-6 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">Experience</div>
                  <div className="px-6 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">Reviews</div>
               </div>

               {/* ABOUT SECTION */}
               <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8">
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-4">About Me</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tutor.about}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading mb-4">Teaching Methodology</h3>
                    <div className="space-y-3">
                       <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-muted-foreground">Interactive live sessions with real-world examples.</p></div>
                       <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-muted-foreground">Weekly mock tests and performance analysis.</p></div>
                       <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-muted-foreground">24/7 doubt clearing support via chat.</p></div>
                    </div>
                  </div>
               </div>

            </div>

            {/* RIGHT SIDEBAR (BOOKING WIDGET) */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl shadow-lg border sticky top-24">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Session Price</div>
                  <div className="flex items-end gap-1 mb-6">
                     <span className="text-4xl font-bold font-heading">₹{tutor.hourlyRate}</span>
                     <span className="text-muted-foreground pb-1">/hr</span>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div className="flex items-center gap-4 p-4 rounded-2xl border bg-slate-50">
                        <Calendar className="w-6 h-6 text-primary" />
                        <div>
                           <div className="font-bold text-sm">Next Available Slot</div>
                           <div className="text-xs text-muted-foreground mt-0.5">{slots[0]}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl border bg-slate-50">
                        <Clock className="w-6 h-6 text-primary" />
                        <div>
                           <div className="font-bold text-sm">Response Time</div>
                           <div className="text-xs text-muted-foreground mt-0.5">Usually responds within 1 hour</div>
                        </div>
                     </div>
                  </div>

                  {bookingStep === "IDLE" && (
                    <div className="space-y-3">
                       <Button onClick={() => setBookingStep("MODAL")} className="w-full h-14 rounded-2xl text-lg font-bold shadow-md hover:scale-[1.02] transition-transform">Book Free Demo</Button>
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-bold">Message Tutor</Button>
                       <p className="text-xs text-center text-muted-foreground mt-4">No credit card required for demo session.</p>
                    </div>
                  )}

                  {/* BOOKING MODAL STATE INLINE */}
                  {bookingStep === "MODAL" && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                       <h4 className="font-bold border-b pb-2">Select a Date & Time</h4>
                       <div className="space-y-2 max-h-48 overflow-y-auto">
                          {slots.map((slot, idx) => (
                             <div 
                               key={idx} 
                               onClick={() => setSelectedSlot(idx)}
                               className={`p-3 rounded-xl border text-sm cursor-pointer transition-colors ${selectedSlot === idx ? 'border-primary bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50'}`}
                             >
                               {slot}
                             </div>
                          ))}
                       </div>
                       <div className="flex gap-2 pt-2">
                          <Button variant="ghost" onClick={() => setBookingStep("IDLE")} className="flex-1 rounded-xl">Cancel</Button>
                          <Button disabled={selectedSlot === null} onClick={handleBookDemo} className="flex-1 rounded-xl">Confirm</Button>
                       </div>
                    </div>
                  )}

                  {bookingStep === "SUCCESS" && (
                    <div className="text-center py-6 animate-in zoom-in fade-in duration-300">
                       <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-success" />
                       </div>
                       <h4 className="text-xl font-bold font-heading mb-2">Demo Booked!</h4>
                       <p className="text-sm text-muted-foreground mb-4">Taking you to your dashboard...</p>
                       <Progress value={100} className="h-1 max-w-[100px] mx-auto animate-pulse" />
                    </div>
                  )}

               </div>
            </div>

         </div>
      </main>
    </div>
  );
}
