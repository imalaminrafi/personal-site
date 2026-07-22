import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { ContactMessage, loadMessages, saveMessages } from "@/data/messages";
import { MessageCircle, Mail, Phone, CheckCircle2, Trash2, Download, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminMessages() {
  const [list, setList] = useState<ContactMessage[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setList(loadMessages()); }, []);

  const save = (updated: ContactMessage[]) => {
    saveMessages(updated);
    setList(updated);
  };

  const toggleReplied = (id: string) => {
    save(list.map((m) => (m.id === id ? { ...m, replied: !m.replied } : m)));
  };

  const deleteMsg = (id: string) => {
    if (!confirm("Delete this message?")) return;
    save(list.filter((m) => m.id !== id));
  };

  const exportCSV = () => {
    const header = "Name,Email,Phone,Subject,Message,Replied,Date";
    const rows = list.map((m) =>
      `"${m.name}","${m.email}","${m.phone}","${m.subject}","${m.message.replace(/"/g, '""')}","${m.replied}","${m.createdAt}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "messages.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Messages">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {list.length} message{list.length !== 1 ? "s" : ""}
        </p>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 text-sm font-bold transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="space-y-3">
        {list.map((msg) => {
          const open = expanded === msg.id;
          return (
            <div key={msg.id} className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden">
              <button onClick={() => setExpanded(open ? null : msg.id)}
                className="w-full flex items-start gap-4 p-5 text-left">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm shrink-0">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{msg.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${msg.replied ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-amber-500 bg-amber-50 dark:bg-amber-500/10"}`}>
                      {msg.replied ? "Replied" : "New"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-zinc-400 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {open ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

              {open && (
                <div className="px-5 pb-5 pt-0 border-t border-zinc-100 dark:border-white/[0.05]">
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <Mail className="w-4 h-4 text-zinc-400" /> {msg.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <Phone className="w-4 h-4 text-zinc-400" /> {msg.phone}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => toggleReplied(msg.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${msg.replied ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {msg.replied ? "Mark Unread" : "Mark Replied"}
                    </button>
                    <button onClick={() => deleteMsg(msg.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No messages</p>
            <p className="text-sm mt-1">Incoming messages will appear here.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
