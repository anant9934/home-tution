"use client";

import { useEffect, useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface Child {
  id: string;
  name: string;
  class: string;
  board: string;
}

interface ChildSelectorProps {
  onSelect: (childId: string | null) => void;
  selectedChildId: string | null;
}

export function ChildSelector({ onSelect, selectedChildId }: ChildSelectorProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchApi("/parents/children")
      .then((data: Child[]) => {
        setChildren(data);
        // Auto-select first child if nothing selected yet
        if (data.length > 0 && !selectedChildId) {
          onSelect(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Don't show selector if there is only 1 or 0 children
  if (children.length <= 1) return null;

  const selected = children.find((c) => c.id === selectedChildId) ?? children[0];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold bg-white border rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors"
      >
        <GraduationCap className="w-4 h-4 text-primary" />
        <span>{selected?.name ?? "Select child"}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-xl z-30 min-w-[200px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                onSelect(child.id);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex flex-col ${
                child.id === selectedChildId ? "bg-primary/5 text-primary font-semibold" : ""
              }`}
            >
              <span className="font-semibold">{child.name}</span>
              <span className="text-xs text-muted-foreground">Class {child.class} • {child.board}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
