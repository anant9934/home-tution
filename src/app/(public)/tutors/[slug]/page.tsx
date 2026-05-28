import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, User, PlayCircle, MapPin, CheckCircle2, BookOpen, Clock, Calendar as CalendarIcon, MessageCircle } from "lucide-react";

export default function TutorProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        
        {/* TOP PROFILE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* HERO CARD */}
            <div className="bg-white rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-muted shrink-0 flex items-center justify-center relative overflow-hidden group border-4 border-white shadow-md">
                 <User className="w-16 h-16 text-primary/30" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <PlayCircle className="w-12 h-12 text-white" />
                 </div>
               </div>
               
               <div className="flex-1 flex flex-col justify-center">
                 <div className="flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-3xl font-bold font-heading">Dr. Sarah Jenkins</h1>
                       <Badge variant="secondary" className="bg-success/10 text-success gap-1 px-2 py-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                       </Badge>
                     </div>
                     <p className="text-lg text-muted-foreground font-medium">Ph.D. in Mathematics • IIT Delhi Alumnus</p>
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                   <div className="flex items-center gap-1.5 font-medium">
                     <Star className="w-5 h-5 text-warning fill-warning" />
                     <span className="text-base">4.9</span>
                     <span className="text-muted-foreground font-normal">(124 reviews)</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
                   <div className="flex items-center gap-1.5 text-muted-foreground">
                     <BookOpen className="w-4 h-4" />
                     10+ Years Exp
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
                   <div className="flex items-center gap-1.5 text-muted-foreground">
                     <MapPin className="w-4 h-4" />
                     Mumbai / Online
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 mt-6">
                   <Badge variant="outline" className="text-sm font-medium px-3 py-1 bg-primary-light/50 border-primary/20 text-primary">Mathematics</Badge>
                   <Badge variant="outline" className="text-sm font-medium px-3 py-1 bg-primary-light/50 border-primary/20 text-primary">Physics</Badge>
                   <Badge variant="outline" className="text-sm font-medium px-3 py-1 bg-primary-light/50 border-primary/20 text-primary">IIT JEE Prep</Badge>
                 </div>
               </div>
            </div>

            {/* TABS SECTION */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="about" className="rounded-lg px-6 py-3 font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">About</TabsTrigger>
                <TabsTrigger value="experience" className="rounded-lg px-6 py-3 font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">Experience</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg px-6 py-3 font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviews</TabsTrigger>
              </TabsList>
              
              <div className="mt-8 bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                <TabsContent value="about" className="mt-0 outline-none space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-4">About Me</h3>
                    <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed">
                      <p>
                        Hello! I'm Dr. Sarah, a passionate mathematics educator with over a decade of experience helping students crack competitive exams like IIT JEE and excel in their board exams. 
                      </p>
                      <p className="mt-4">
                        My teaching philosophy revolves around building a strong foundational understanding rather than rote memorization. I believe every student can master complex mathematical concepts if they are taught in a relatable, step-by-step manner.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-4">Teaching Methodology</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        Interactive live sessions with real-world examples.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        Weekly mock tests and performance analysis.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        24/7 doubt clearing support via chat.
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="mt-0 outline-none">
                  <div className="space-y-8">
                     <div className="relative pl-6 border-l-2 border-border">
                       <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                       <h4 className="font-bold text-lg">Senior Mathematics Faculty</h4>
                       <p className="text-primary font-medium mb-2">Allen Career Institute • 2018 - Present</p>
                       <p className="text-muted-foreground text-sm">Lead instructor for IIT-JEE advanced batches. Mentored over 500+ students who successfully cleared the exam.</p>
                     </div>
                     <div className="relative pl-6 border-l-2 border-border">
                       <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                       <h4 className="font-bold text-lg">Guest Lecturer</h4>
                       <p className="text-primary font-medium mb-2">Delhi Public School • 2015 - 2018</p>
                       <p className="text-muted-foreground text-sm">Conducted special weekend workshops for Class 11 and 12 students focusing on board exam strategies.</p>
                     </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-0 outline-none space-y-6">
                   <div className="flex items-center gap-6 p-6 bg-primary-light/30 rounded-2xl border border-primary/10">
                     <div className="text-center">
                       <div className="text-4xl font-bold font-heading text-primary">4.9</div>
                       <div className="flex text-warning mt-2">
                         <Star className="w-4 h-4 fill-warning" />
                         <Star className="w-4 h-4 fill-warning" />
                         <Star className="w-4 h-4 fill-warning" />
                         <Star className="w-4 h-4 fill-warning" />
                         <Star className="w-4 h-4 fill-warning" />
                       </div>
                       <div className="text-xs text-muted-foreground mt-1">124 Ratings</div>
                     </div>
                     <div className="flex-1 space-y-2">
                       {/* Rating bars would go here */}
                       <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-warning w-[90%] rounded-full"></div>
                       </div>
                       <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-warning w-[8%] rounded-full"></div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-6 pt-4">
                     {[1, 2].map(i => (
                       <div key={i} className="border-b pb-6 last:border-0">
                         <div className="flex justify-between items-start mb-3">
                           <div className="flex gap-3 items-center">
                             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                               {i === 1 ? 'R' : 'A'}
                             </div>
                             <div>
                               <div className="font-bold">{i === 1 ? 'Rahul Verma' : 'Anjali Sharma'}</div>
                               <div className="text-xs text-muted-foreground">Class 12 Student • 2 weeks ago</div>
                             </div>
                           </div>
                           <div className="flex text-warning">
                             <Star className="w-4 h-4 fill-warning" />
                             <Star className="w-4 h-4 fill-warning" />
                             <Star className="w-4 h-4 fill-warning" />
                             <Star className="w-4 h-4 fill-warning" />
                             <Star className="w-4 h-4 fill-warning" />
                           </div>
                         </div>
                         <p className="text-muted-foreground text-sm leading-relaxed">
                           "Dr. Sarah is an amazing teacher! Her way of explaining complex calculus problems made it so easy for me to understand. I scored 95/100 in my pre-boards thanks to her."
                         </p>
                       </div>
                     ))}
                   </div>
                </TabsContent>
              </div>
            </Tabs>

          </div>

          {/* RIGHT BOOKING PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border shadow-lg p-6 sticky top-24">
               <div className="flex justify-between items-end mb-6">
                 <div>
                   <p className="text-sm text-muted-foreground font-medium mb-1">Session Price</p>
                   <div className="text-3xl font-bold">₹800<span className="text-lg text-muted-foreground font-normal">/hr</span></div>
                 </div>
               </div>
               
               <div className="space-y-4 mb-8">
                 <div className="flex gap-3 items-start p-3 bg-muted/50 rounded-xl border">
                    <CalendarIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Next Available Slot</div>
                      <div className="text-xs text-muted-foreground">Tomorrow, 4:00 PM - 5:00 PM</div>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start p-3 bg-muted/50 rounded-xl border">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Response Time</div>
                      <div className="text-xs text-muted-foreground">Usually responds within 1 hour</div>
                    </div>
                 </div>
               </div>

               <div className="space-y-3">
                 <Button className="w-full rounded-xl h-12 text-base font-semibold shadow-md">Book Free Demo</Button>
                 <Button variant="outline" className="w-full rounded-xl h-12 text-base font-semibold gap-2">
                   <MessageCircle className="w-5 h-5" /> Message Tutor
                 </Button>
               </div>
               
               <p className="text-xs text-center text-muted-foreground mt-4">
                 No credit card required for demo session.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
