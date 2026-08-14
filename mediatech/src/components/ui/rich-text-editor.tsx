"use client";

import { useRef, useEffect } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  QueueListIcon,
  LinkIcon,
  PhotoIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing or formatting your content...",
  minHeight = "350px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync prop value into DOM innerHTML safely without resetting cursor during active typing
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const emitChange = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleFontFamilyChange = (font: string) => {
    executeCommand("fontName", font);
  };

  const handleFontSizeChange = (sizePx: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.fontSize = sizePx;
      const range = selection.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch (e) {
        executeCommand("fontSize", "4");
      }
      emitChange();
    } else {
      executeCommand("fontSize", "4");
    }
  };

  const handleColorChange = (color: string) => {
    executeCommand("foreColor", color);
  };

  const handleHighlightChange = (color: string) => {
    executeCommand("hiliteColor", color);
  };

  const handleAddLink = () => {
    const url = prompt("Enter website or link URL (e.g. https://example.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { compressImage } = await import("@/lib/image-utils");
        const imageUrl = await compressImage(file, 1000, 800, 0.82);
        const imgHtml = `<div class="my-4 text-center select-none"><img src="${imageUrl}" alt="Uploaded image" style="max-width:100%; border-radius:12px; display:inline-block;" /><p class="text-xs text-slate-400 mt-1 italic">Image Caption (Click text to edit)</p></div><p><br></p>`;
        executeCommand("insertHTML", imgHtml);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          const imgHtml = `<div class="my-4 text-center select-none"><img src="${imageUrl}" alt="Uploaded image" style="max-width:100%; border-radius:12px; display:inline-block;" /><p class="text-xs text-slate-400 mt-1 italic">Image Caption (Click text to edit)</p></div><p><br></p>`;
          executeCommand("insertHTML", imgHtml);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Word-like Formatting Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center gap-1.5 flex-wrap font-inter text-xs text-slate-700 select-none">
        {/* Font Family Select */}
        <select
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          defaultValue="Inter, sans-serif"
          className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium focus:outline-none hover:bg-slate-100 cursor-pointer"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Courier New', monospace">Monospace</option>
        </select>

        {/* Font Size Select */}
        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          defaultValue="16px"
          className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium focus:outline-none hover:bg-slate-100 cursor-pointer"
        >
          <option value="12px">12px (Small)</option>
          <option value="14px">14px</option>
          <option value="16px">16px (Body)</option>
          <option value="18px">18px (Large)</option>
          <option value="20px">20px (Heading 3)</option>
          <option value="24px">24px (Heading 2)</option>
          <option value="32px">32px (Heading 1)</option>
        </select>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Text Formatting Buttons */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-800 font-bold"
          title="Bold (Ctrl+B)"
        >
          <BoldIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-800 italic"
          title="Italic (Ctrl+I)"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-800 underline"
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Colors & Highlight Pickers */}
        <div className="flex items-center gap-1">
          <label title="Text Color" className="flex items-center gap-1 cursor-pointer px-1.5 py-1 rounded hover:bg-slate-200">
            <span className="font-bold text-xs">A</span>
            <input type="color" onChange={(e) => handleColorChange(e.target.value)} className="w-3.5 h-3.5 border-0 p-0 cursor-pointer bg-transparent" />
          </label>
          <label title="Highlight Text Color" className="flex items-center gap-1 cursor-pointer px-1.5 py-1 rounded hover:bg-slate-200">
            <span className="font-bold text-xs bg-amber-200 px-0.5 rounded">H</span>
            <input type="color" defaultValue="#fef08a" onChange={(e) => handleHighlightChange(e.target.value)} className="w-3.5 h-3.5 border-0 p-0 cursor-pointer bg-transparent" />
          </label>
        </div>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Alignment Controls */}
        <button type="button" onClick={() => executeCommand("justifyLeft")} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Align Left">
          <Bars3BottomLeftIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => executeCommand("justifyCenter")} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Align Center">
          <Bars3Icon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => executeCommand("justifyRight")} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Align Right">
          <Bars3BottomRightIcon className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Lists & Headings */}
        <button type="button" onClick={() => executeCommand("insertUnorderedList")} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Bullet List">
          <ListBulletIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => executeCommand("insertOrderedList")} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Numbered List">
          <QueueListIcon className="w-4 h-4" />
        </button>

        <button type="button" onClick={() => executeCommand("formatBlock", "<h2>")} className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-800" title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => executeCommand("formatBlock", "<h3>")} className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-800" title="Heading 3">
          H3
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Link & Image Insertion */}
        <button type="button" onClick={handleAddLink} className="p-1.5 rounded hover:bg-slate-200 text-slate-700" title="Insert Web Link">
          <LinkIcon className="w-4 h-4" />
        </button>

        <label className="p-1.5 rounded hover:bg-amber-100 bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer flex items-center gap-1 text-xs font-bold transition" title="Insert Image Anywhere in Content">
          <PhotoIcon className="w-4 h-4 text-amber-600" />
          <span>Insert Image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* Editable Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={emitChange}
        style={{ minHeight }}
        className="p-5 outline-none font-inter text-slate-900 leading-relaxed max-w-none prose focus:ring-0 cursor-text"
      />
    </div>
  );
}
