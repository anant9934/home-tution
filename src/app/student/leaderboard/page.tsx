"use client";

import { Trophy, Medal, ChevronUp, Star, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const leaderboardData = [
  { rank: 1, name: "Sneha Sharma", xp: 5400, avatar: "SS", change: "up", streak: 45 },
  { rank: 2, name: "Arjun Mehta", xp: 5250, avatar: "AM", change: "same", streak: 30 },
  { rank: 3, name: "Rahul Verma", xp: 5120, avatar: "RV", change: "up", streak: 28, isCurrentUser: true },
  { rank: 4, name: "Ananya Roy", xp: 4900, avatar: "AR", change: "down", streak: 15 },
  { rank: 5, name: "Vikram Singh", xp: 4850, avatar: "VS", change: "same", streak: 12 },
  { rank: 6, name: "Priya Patel", xp: 4600, avatar: "PP", change: "up", streak: 10 },
  { rank: 7, name: "Rohan Gupta", xp: 4500, avatar: "RG", change: "down", streak: 8 },
];

export default function StudentLeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 lg:pb-8">
      <div className="text-center space-y-2">
         <h1 className="text-4xl font-bold font-heading flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-warning" /> Class Leaderboard
         </h1>
         <p className="text-muted-foreground">Compete with your peers and earn XP by completing quizzes and assignments.</p>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end gap-2 sm:gap-6 mt-12 h-64">
         {/* 2nd Place */}
         <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 delay-100">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-slate-300 shadow-xl z-10 -mb-6">
               <AvatarFallback className="bg-slate-100 font-bold text-slate-600">{leaderboardData[1].avatar}</AvatarFallback>
            </Avatar>
            <div className="w-24 sm:w-32 h-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl flex flex-col items-center justify-start pt-8 border-x border-t border-slate-300 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 mask-image-linear"></div>
               <span className="text-4xl font-bold text-slate-400 font-heading">2</span>
               <span className="text-xs font-bold text-slate-500 mt-2 text-center px-2 line-clamp-1">{leaderboardData[1].name}</span>
               <span className="text-xs text-slate-400">{leaderboardData[1].xp} XP</span>
            </div>
         </div>
         
         {/* 1st Place */}
         <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700">
            <div className="relative">
               <Trophy className="w-8 h-8 text-warning absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
               <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-warning shadow-warning/50 shadow-2xl z-10 -mb-8">
                  <AvatarFallback className="bg-warning/10 font-bold text-warning">{leaderboardData[0].avatar}</AvatarFallback>
               </Avatar>
            </div>
            <div className="w-28 sm:w-36 h-48 bg-gradient-to-t from-warning/20 to-warning/10 rounded-t-xl flex flex-col items-center justify-start pt-10 border-x border-t border-warning/30 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 mask-image-linear"></div>
               <span className="text-5xl font-bold text-warning font-heading drop-shadow-sm">1</span>
               <span className="text-sm font-bold text-warning-foreground mt-2 text-center px-2 line-clamp-1">{leaderboardData[0].name}</span>
               <span className="text-xs font-semibold text-warning-foreground/70">{leaderboardData[0].xp} XP</span>
            </div>
         </div>

         {/* 3rd Place */}
         <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-orange-300 shadow-xl z-10 -mb-6">
               <AvatarFallback className="bg-orange-50 font-bold text-orange-600">{leaderboardData[2].avatar}</AvatarFallback>
            </Avatar>
            <div className="w-24 sm:w-32 h-24 bg-gradient-to-t from-orange-100 to-orange-50 rounded-t-xl flex flex-col items-center justify-start pt-8 border-x border-t border-orange-200 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 mask-image-linear"></div>
               <span className="text-4xl font-bold text-orange-400 font-heading">3</span>
               <span className="text-xs font-bold text-orange-700 mt-2 text-center px-2 line-clamp-1">{leaderboardData[2].name}</span>
               <span className="text-xs text-orange-600/70">{leaderboardData[2].xp} XP</span>
            </div>
         </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
         <div className="divide-y">
            {leaderboardData.slice(3).map((student, i) => (
               <div key={student.rank} className={`flex items-center justify-between p-4 sm:p-6 transition-colors hover:bg-slate-50 ${student.isCurrentUser ? 'bg-primary/5 hover:bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-4 sm:gap-6">
                     <div className="font-bold text-lg text-muted-foreground w-6 text-center">{student.rank}</div>
                     <Avatar className="w-10 h-10 border shadow-sm">
                        <AvatarFallback className={`font-bold ${student.isCurrentUser ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>{student.avatar}</AvatarFallback>
                     </Avatar>
                     <div>
                        <div className="font-bold flex items-center gap-2">
                           {student.name}
                           {student.isCurrentUser && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                           <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {student.xp} XP</span>
                           <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> {student.streak} Day Streak</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0">
                     {student.change === "up" && <ChevronUp className="w-5 h-5 text-success" />}
                     {student.change === "down" && <ChevronUp className="w-5 h-5 text-destructive rotate-180" />}
                     {student.change === "same" && <div className="w-2 h-0.5 bg-muted-foreground/50 rounded-full my-2 mr-1.5" />}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
