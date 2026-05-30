"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Star, Flame, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

export default function StudentLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await fetchApi("/students/leaderboard");
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error || leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load leaderboard</h2>
        <p className="text-muted-foreground">{error || "No data available"}</p>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const currentUser = leaderboard.find(u => u.isCurrent);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 lg:pb-8">
      <div className="text-center mb-12">
         <h1 className="text-4xl font-bold font-heading mb-2">Global Leaderboard</h1>
         <p className="text-muted-foreground">Compete with your peers and earn your spot at the top.</p>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 pt-10 mb-16">
         {/* Rank 2 */}
         {top3[1] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
               <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-300 overflow-hidden shadow-lg bg-white">
                     <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                     2
                  </div>
               </div>
               <div className="font-bold text-sm text-center line-clamp-1 max-w-[80px]">{top3[1].name.split(' ')[0]}</div>
               <div className="text-xs font-semibold text-muted-foreground mt-1">{top3[1].xp} XP</div>
               <div className="w-24 h-24 bg-gradient-to-t from-slate-200 to-slate-50 mt-4 rounded-t-xl border border-b-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)]"></div>
            </div>
         )}
         
         {/* Rank 1 */}
         {top3[0] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
               <div className="relative mb-4">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                     <Medal className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                  </div>
                  <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl bg-white">
                     <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm text-lg">
                     1
                  </div>
               </div>
               <div className="font-bold text-lg text-center line-clamp-1 max-w-[100px]">{top3[0].name.split(' ')[0]}</div>
               <div className="text-sm font-bold text-warning mt-1">{top3[0].xp} XP</div>
               <div className="w-32 h-32 bg-gradient-to-t from-yellow-200/50 to-yellow-50/50 mt-4 rounded-t-xl border border-yellow-200 border-b-0 shadow-[inset_0_4px_20px_rgba(250,204,21,0.15)] flex justify-center pt-4">
                  <Star className="w-6 h-6 text-yellow-400/50 fill-yellow-400/50" />
               </div>
            </div>
         )}

         {/* Rank 3 */}
         {top3[2] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
               <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-orange-300 overflow-hidden shadow-lg bg-white">
                     <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                     3
                  </div>
               </div>
               <div className="font-bold text-sm text-center line-clamp-1 max-w-[80px]">{top3[2].name.split(' ')[0]}</div>
               <div className="text-xs font-semibold text-muted-foreground mt-1">{top3[2].xp} XP</div>
               <div className="w-24 h-16 bg-gradient-to-t from-orange-100 to-orange-50 mt-4 rounded-t-xl border border-orange-200 border-b-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]"></div>
            </div>
         )}
      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl border shadow-sm p-2 sm:p-4 overflow-hidden">
         {rest.map((user, idx) => (
            <div 
               key={user.id} 
               className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${user.isCurrent ? 'bg-primary/5 border border-primary/20' : 'hover:bg-slate-50 border border-transparent'}`}
            >
               <div className="flex items-center gap-4">
                  <div className={`font-bold w-6 text-center ${user.isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                     {user.rank}
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className={`font-bold ${user.isCurrent ? 'text-primary' : ''}`}>
                        {user.name} {user.isCurrent && "(You)"}
                     </h4>
                     <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                        <Trophy className="w-3 h-3" /> {user.badges} Badges
                     </div>
                  </div>
               </div>
               <div className="font-bold font-heading text-lg">
                  {user.xp} <span className="text-sm font-normal text-muted-foreground">XP</span>
               </div>
            </div>
         ))}
      </div>

      {/* Current User Sticky Bar (if not in top 5 maybe?) */}
      {currentUser && currentUser.rank > 5 && (
         <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-72 max-w-3xl lg:mx-auto bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-12 z-40">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 shrink-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
               </div>
               <div>
                  <div className="text-xs text-white/60 font-semibold mb-0.5">Your Current Rank</div>
                  <h4 className="font-bold">#{currentUser.rank} out of {leaderboard.length}</h4>
               </div>
            </div>
            <div className="text-right">
               <div className="font-bold font-heading text-xl text-warning">{currentUser.xp} XP</div>
               <div className="text-xs text-white/60 flex items-center gap-1 mt-1 justify-end"><Flame className="w-3 h-3 text-orange-400" /> Keep pushing!</div>
            </div>
         </div>
      )}

    </div>
  );
}
