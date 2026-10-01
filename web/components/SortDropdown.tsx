"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { SortOption } from "@/lib/types";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "stars", label: "Most starred" },
  { value: "updated", label: "Recently updated" },
  { value: "downloads", label: "Most downloaded" },
  { value: "added", label: "Recently added" },
  { value: "alphabetical", label: "Alphabetical (A-Z)" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full sm:w-auto shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="h-10 w-full sm:w-44 rounded-xl bg-card border border-input pl-3.5 pr-3 text-xs font-medium text-foreground flex items-center justify-between shadow-xs hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:border-foreground/30 cursor-pointer"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2" />
      </button>

      {/* Shadcn-styled Pop-up Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[12rem] w-full sm:w-48 rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95"
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer select-none outline-none ${
                  isSelected
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-foreground stroke-[2.5] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
