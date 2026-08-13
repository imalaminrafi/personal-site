import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { ContactMessage, loadMessages, saveMessages } from "@/data/messages";
import { Mail, Phone, CheckCircle2, Trash2, Download, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { Btn, Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";

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

  const unread = list.filter((m) => !m.replied).length;

  return (
    <AdminLayout title="Messages">
      <PageHeader
        title="Contact Messages"
        description={unread > 0 ? `${unread} unread message${unread !== 1 ? "s" : ""} waiting for a reply.` : "All messages have been replied to."}
        actions={
          <Btn variant="secondary" onClick={exportCSV}><Download className="h-4 w-4" /> Export CSV</Btn>
        }
      />

      {list.length === 0 ? (
        <Card>
          <EmptyState icon={Inbox} title="No messages" description="Incoming contact form submissions will appear here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((msg) => {
            const open = expanded === msg.id;
            return (
              <Card key={msg.id} className="overflow-hidden">
                <button onClick={() => setExpanded(open ? null : msg.id)}
                  className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{msg.name}</span>
                      <Badge tone={msg.replied ? "emerald" : "amber"}>{msg.replied ? "Replied" : "New"}</Badge>
                    </div>
                    <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{msg.subject}</p>
                    <p className="mt-1 text-xs text-zinc-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0 text-zinc-400">
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {open && (
                  <div className="border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-white/[0.05]">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 dark:text-zinc-300">
                        <Mail className="h-4 w-4 text-zinc-400" /> {msg.email}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-600 dark:text-zinc-300">
                        <Phone className="h-4 w-4 text-zinc-400" /> {msg.phone}
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">{msg.message}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Btn variant={msg.replied ? "secondary" : "primary"} size="sm" onClick={() => toggleReplied(msg.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> {msg.replied ? "Mark Unread" : "Mark Replied"}
                      </Btn>
                      <Btn variant="danger" size="sm" onClick={() => deleteMsg(msg.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Btn>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}