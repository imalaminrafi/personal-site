import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { MessageSquare, Mail, Trash2, ChevronDown, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  date: string;
}

const STORAGE_KEY = "ar_messages";

function loadMessages(): Message[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

const demoMessages: Message[] = [
  {
    id: "msg-1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Collaboration Opportunity",
    body: "Hi Alamin, I love your work! I'd like to discuss a potential collaboration on a web design project. Let me know if you're available.",
    read: false,
    date: "2026-07-21T14:30:00Z",
  },
  {
    id: "msg-2",
    name: "Mike Chen",
    email: "mike@example.com",
    subject: "Freelance Project",
    body: "Hey, I need a full-stack developer for my startup. Your portfolio looks like a great fit. Can we set up a call?",
    read: false,
    date: "2026-07-20T10:15:00Z",
  },
  {
    id: "msg-3",
    name: "Emily Davis",
    email: "emily@example.com",
    subject: "Website Feedback",
    body: "Great website! I was particularly impressed with the 3D visualizations. Would love to see more case studies.",
    read: true,
    date: "2026-07-18T09:00:00Z",
  },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadMessages();
    return stored.length ? stored : demoMessages;
  });
  const [selected, setSelected] = useState<Message | null>(null);

  const persist = (msgs: Message[]) => {
    setMessages(msgs);
    saveMessages(msgs);
  };

  const markRead = (id: string) => {
    if (messages.find(m => m.id === id)?.read) return;
    persist(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected?.id === id) setSelected(null);
    persist(messages.filter(m => m.id !== id));
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout title="Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Inbox</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                {unreadCount} new
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {messages.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">No messages yet</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { markRead(msg.id); setSelected(msg); }}
                className={`p-4 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!msg.read ? "bg-violet-50/50 dark:bg-violet-500/5" : ""} ${selected?.id === msg.id ? "bg-violet-50 dark:bg-violet-500/10" : ""}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-sm ${!msg.read ? "font-bold" : "font-medium"} text-zinc-900 dark:text-white truncate`}>
                    {msg.name}
                  </p>
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="p-1 text-zinc-300 hover:text-red-500 shrink-0 ml-2"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{msg.subject}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                  {new Date(msg.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-y-auto">
          {!selected ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <Mail className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400 text-sm">Select a message to view</p>
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{selected.subject}</h2>
                <p className="text-sm text-zinc-500">
                  From: <span className="font-medium text-zinc-700 dark:text-zinc-300">{selected.name}</span> &lt;{selected.email}&gt;
                </p>
                <p className="text-xs text-zinc-400">{new Date(selected.date).toLocaleString()}</p>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">{selected.body}</p>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
