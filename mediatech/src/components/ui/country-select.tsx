"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ALL_COUNTRIES, CountryItem } from "@/lib/countries";

interface CountrySelectProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  onChange?: (country: string) => void;
}

export function CountrySelect({
  name,
  defaultValue = "",
  placeholder = "Select Country...",
  required = false,
  className = "",
  showAllOption = false,
  allOptionLabel = "All Countries",
  onChange,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || "");
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelected(defaultValue || "");
  }, [defaultValue]);

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

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    c.code.toLowerCase().includes(search.toLowerCase().trim())
  );

  const selectedItem = ALL_COUNTRIES.find(
    (c) => c.name.toLowerCase() === selected.toLowerCase() || c.code.toLowerCase() === selected.toLowerCase()
  );

  const handleSelect = (val: string) => {
    setSelected(val);
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Hidden input to ensure standard form submission works */}
      <input type="hidden" name={name} value={selected} required={required} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input text-left flex items-center justify-between cursor-pointer w-full bg-white hover:border-slate-400 focus:outline-none"
        style={{ minHeight: "42px", padding: "8px 12px" }}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedItem ? (
            <>
              <span className="text-base leading-none">{selectedItem.flag}</span>
              <span className="text-dark font-medium font-inter text-sm truncate">{selectedItem.name}</span>
            </>
          ) : selected ? (
            <span className="text-dark font-medium font-inter text-sm truncate">{selected}</span>
          ) : (
            <span className="text-muted font-inter text-sm">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col left-0"
          style={{ maxHeight: "320px", minWidth: "220px" }}
        >
          {/* Search bar inside dropdown */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
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

          {/* Options List */}
          <div
            className="overflow-y-auto overscroll-contain divide-y divide-slate-50"
            style={{ maxHeight: "260px" }}
          >
            {showAllOption && !search && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full text-left px-3.5 py-2.5 text-sm font-inter flex items-center justify-between transition-colors ${
                  !selected ? "bg-amber-50 text-amber-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>{allOptionLabel}</span>
                </span>
                {!selected && <CheckIcon className="w-4 h-4 text-amber-600 shrink-0" />}
              </button>
            )}

            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted font-inter">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected =
                  selected.toLowerCase() === c.name.toLowerCase() ||
                  selected.toLowerCase() === c.code.toLowerCase();
                return (
                  <button
                    key={c.code + c.name}
                    type="button"
                    onClick={() => handleSelect(c.name)}
                    className={`w-full text-left px-3.5 py-2 text-sm font-inter flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
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
