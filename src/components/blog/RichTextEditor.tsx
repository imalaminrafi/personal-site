import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading, List, ListOrdered, Link, Image, Eye, Edit3 } from "lucide-react";

type Tab = "editor" | "preview";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [tab, setTab] = useState<Tab>("editor");
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter link URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) exec("insertImage", url);
  }, [exec]);

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const toolbar = [
    { icon: Bold, label: "Bold", action: () => exec("bold") },
    { icon: Italic, label: "Italic", action: () => exec("italic") },
    { icon: Heading, label: "H2", action: () => exec("formatBlock", "<h2>") },
    { icon: Heading, label: "H3", action: () => exec("formatBlock", "<h3>") },
    { icon: List, label: "Bullet List", action: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Ordered List", action: () => exec("insertOrderedList") },
    { icon: Link, label: "Link", action: insertLink },
    { icon: Image, label: "Image", action: insertImage },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f]">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbar.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              title={label}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setTab("editor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              tab === "editor"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              tab === "preview"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {tab === "editor" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
          className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto text-zinc-900 dark:text-white focus:outline-none prose prose-zinc dark:prose-invert max-w-none"
        />
      ) : (
        <div
          className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto text-zinc-600 dark:text-zinc-300 prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-zinc-400 dark:text-zinc-600 italic'>No content yet.</p>" }}
        />
      )}
    </div>
  );
}
