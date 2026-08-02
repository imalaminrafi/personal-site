import { useCallback, useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Youtube } from "@tiptap/extension-youtube";
import { FontFamily } from "@tiptap/extension-font-family";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { optimizeImage, readFileAsDataURL } from "@/utils/imageOptimizer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered,
  Quote, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link, Image, Table as TableIcon, Video, Code, Undo2, Redo2, Highlighter, Palette, Type,
  Eye, Edit3
} from "lucide-react";

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  onAutoSave?: () => void;
}

const FontSize = TextStyle.extend({
  addAttributes() {
    return { style: { default: null, parseHTML: (el) => el.getAttribute("style"), renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}) } };
  },
  addGlobalAttributes() {
    return [{ types: ["textStyle"], attributes: { style: { default: null, parseHTML: (el) => el.getAttribute("style"), renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}) } } }];
  },
});

export default function WysiwygEditor({ value, onChange, onAutoSave }: WysiwygEditorProps) {
  const [preview, setPreview] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 dark:text-blue-400 underline hover:opacity-80" } }),
      ImageExtension.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: "max-w-full h-auto rounded-xl my-4", loading: "lazy" } }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your article...", emptyEditorClass: "is-editor-empty" }),
      Youtube.configure({ modestBranding: true, HTMLAttributes: { class: "w-full aspect-video rounded-xl my-4" } }),
      Dropcursor.configure({ color: "#7c3aed", width: 2 }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => onAutoSave?.(), 3000);
    },
    editorProps: {
      attributes: { class: "prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-6 py-4 text-zinc-900 dark:text-white" },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) handleImageFile(file);
            return true;
          }
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files;
        if (!files) return false;
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageFile(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  useEffect(() => { return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); }; }, []);

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/") || !editor) return;
    try {
      const asset = await uploadToCloudinary(file, { folder: "alaminrafi" });
      addToMediaLibrary(fromCloudinaryAsset(asset, file.name));
      editor.chain().focus().setImage({ src: asset.secureUrl || asset.url }).run();
    } catch {
      try {
        const opt = await optimizeImage(file, { maxWidth: 1920, quality: 0.8, format: "image/webp" });
        editor.chain().focus().setImage({ src: opt.dataUrl }).run();
      } catch {
        const url = await readFileAsDataURL(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    if (e.target) e.target.value = "";
  }

  function addLink() {
    if (!editor) return;
    if (showLinkInput) {
      if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run();
      setShowLinkInput(false);
      setLinkUrl("");
    } else {
      const prev = editor.getAttributes("link").href || "";
      setLinkUrl(prev);
      setShowLinkInput(true);
    }
  }

  function addTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function addYouTube() {
    const url = prompt("Enter YouTube video URL:");
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function setFontSize(size: string) {
    editor?.chain().focus().setMark("textStyle", { style: `font-size: ${size}px` }).run();
    setShowFontSize(false);
  }

  function setColor(color: string) {
    editor?.chain().focus().setColor(color).run();
    setShowColors(false);
  }

  const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length ?? 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!editor) return null;

  const ToolbarBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button type="button" onClick={onClick} title={title}
      className={`p-1.5 rounded-lg transition-colors ${active ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"}`}>
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-zinc-200 dark:bg-white/[0.08]" />;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden bg-white dark:bg-[#0F2040]">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#0F2040]/50 sticky top-0 z-10">
        {/* History */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo2 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo2 className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Text formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"><UnderlineIcon className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight"><Highlighter className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Font size */}
        <div className="relative">
          <ToolbarBtn onClick={() => { setShowFontSize(!showFontSize); setShowColors(false); }} title="Font Size"><Type className="w-4 h-4" /></ToolbarBtn>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#14233F] rounded-xl border border-zinc-200 dark:border-white/[0.08] shadow-xl p-1.5 flex gap-1 z-20">
              {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
                <button key={s} type="button" onClick={() => setFontSize(String(s))} className="px-2 py-1 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors" style={{ fontSize: `${Math.min(s, 20)}px` }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {/* Text color */}
        <div className="relative">
          <ToolbarBtn onClick={() => { setShowColors(!showColors); setShowFontSize(false); }} title="Text Color"><Palette className="w-4 h-4" /></ToolbarBtn>
          {showColors && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#14233F] rounded-xl border border-zinc-200 dark:border-white/[0.08] shadow-xl p-2 z-20">
              <div className="grid grid-cols-8 gap-1">
                {["#000000","#ffffff","#dc2626","#ea580c","#d97706","#65a30d","#16a34a","#0891b2","#2563eb","#7c3aed","#db2777","#78716c"].map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className="w-6 h-6 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
              <button type="button" onClick={() => { editor?.chain().focus().unsetColor().run(); setShowColors(false); }} className="mt-2 px-3 py-1 rounded-lg text-[10px] font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 w-full">Remove Color</button>
            </div>
          )}
        </div>
        <Divider />

        {/* Headings */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Center"><AlignCenter className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify"><AlignJustify className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Insert */}
        <ToolbarBtn onClick={addLink} active={editor.isActive("link")} title="Insert Link"><Link className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => fileInputRef.current?.click()} title="Insert Image"><Image className="w-4 h-4" /></ToolbarBtn>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <ToolbarBtn onClick={addTable} title="Insert Table"><TableIcon className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={addYouTube} title="Insert YouTube Video"><Video className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block"><Code className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {showLinkInput && (
          <div className="flex items-center gap-2 ml-2">
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] text-xs w-48 focus:outline-none" autoFocus onKeyDown={(e) => { if (e.key === "Enter") addLink(); if (e.key === "Escape") setShowLinkInput(false); }} />
            <button type="button" onClick={addLink} className="px-2 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold">Apply</button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <ToolbarBtn onClick={() => setPreview(!preview)} active={preview} title={preview ? "Editor" : "Preview"}>
            {preview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </ToolbarBtn>
        </div>
      </div>

      {preview ? (
        <div className="prose prose-zinc dark:prose-invert max-w-none px-6 py-4 min-h-[500px] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: editor.getHTML() || "<p class='text-zinc-400 italic'>No content yet.</p>" }} />
      ) : (
        <EditorContent editor={editor} className="[&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:px-6 [&_.ProseMirror]:py-4" />
      )}

      <div className="flex items-center justify-between px-6 py-2 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#0F2040]/50 text-[11px] text-zinc-500">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>~{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Auto-saves every 3s</span>
        </div>
      </div>
    </div>
  );
}
