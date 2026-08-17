"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";

interface SearchableSelectProps {
  name: string;
  options: readonly string[] | string[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

export function SearchableSelect({
  name,
  options,
  defaultValue,
  placeholder = "Select Category...",
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || "");
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    const label = opt === "" ? (placeholder || "All") : opt;
    return label.toLowerCase().includes(search.toLowerCase().trim());
  });

  const displayLabel = selected ? selected : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hidden input to ensure standard form submission works */}
      <input type="hidden" name={name} value={selected} required={required} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input text-left flex items-center justify-between cursor-pointer w-full bg-white hover:border-slate-400 focus:outline-none"
        style={{ padding: "10px 14px" }}
      >
        <span className={selected ? "text-dark font-medium font-inter" : "text-muted font-inter"}>
          {displayLabel}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col"
          style={{ maxHeight: "320px" }}
        >
          {/* Search bar inside dropdown */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="w-full bg-transparent border-none text-xs font-inter text-dark focus:outline-none py-1"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-inter"
              >
                Clear
              </button>
            )}
          </div>

          {/* Options List with smooth contained scroll */}
          <div
            className="overflow-y-auto overscroll-contain divide-y divide-slate-50"
            style={{ maxHeight: "260px" }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted font-inter">
                No matching category found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt === selected;
                const optLabel = opt === "" ? (placeholder || "All") : opt;
                return (
                  <button
                    key={opt || "ALL_OPTION"}
                    type="button"
                    onClick={() => {
                      setSelected(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm font-inter flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{optLabel}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
