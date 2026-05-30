"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Clock, Check } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await fetchApi("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi("/notifications/read-all", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch(type) {
      case 'ASSIGNMENT': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'FEE': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50">
            <h3 className="font-bold font-heading flex items-center gap-2">
              Notifications
              {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                 <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                 Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Bell className="w-8 h-8 text-muted/50 mb-3" />
                <p className="text-sm font-medium">You&apos;re all caught up!</p>
                <p className="text-xs mt-1">No new notifications.</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                    }}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-muted'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer">
                      <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-foreground' : 'font-semibold text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 flex items-center justify-center w-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-slate-50 text-center">
             <button className="text-xs font-semibold text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
               Close Menu
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
