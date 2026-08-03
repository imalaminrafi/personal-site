import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
    Plus, Trash2, Save, ChevronDown, ChevronUp,
    ArrowLeft, ExternalLink
} from "lucide-react";
import {
    loadProjects, saveProjects, STEPS,
    type Project, type ProjectStatus, type Step
} from "@/data/projects";

const STATUS_OPTIONS: ProjectStatus[] = ["Active", "In Progress", "Completed", "On Hold"];

function emptyProject(): Project {
    return {
        id: "",
        clientName: "",
        projectName: "",
        description: "",
        status: "Active",
        currentStep: 0,
        progress: 0,
        currentMessage: "",
        nextUpdateIn: "24 hours",
        updates: [],
        whatsapp: "8801917443161",
        email: "hello@alaminrafi.com",
        deliverableUrl: "",
    };
}

/* ── Project Form ────────────────────────────────────────────── */
function ProjectForm({
    initial,
    onSave,
    onCancel,
    onDelete,
}: {
    initial: Project;
    onSave: (p: Project) => void;
    onCancel: () => void;
    onDelete?: () => void;
}) {
    const [p, setP] = useState<Project>(initial);
    const [newUpdate, setNewUpdate] = useState("");

    const set = <K extends keyof Project>(key: K, val: Project[K]) =>
        setP(prev => ({ ...prev, [key]: val }));

    const addUpdate = () => {
        if (!newUpdate.trim()) return;
        setP(prev => ({
            ...prev,
            updates: [{ date: new Date().toISOString(), message: newUpdate.trim() }, ...prev.updates],
        }));
        setNewUpdate("");
    };

    const removeUpdate = (i: number) =>
        setP(prev => ({ ...prev, updates: prev.updates.filter((_, idx) => idx !== i) }));

    return (
        <div className="space-y-5">
            {/* Basic info */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Project Info</h3>

                <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Project ID (URL slug)" value={p.id} onChange={v => set("id", v)} placeholder="e.g. novatech-001" />
                    <Field label="Client Name" value={p.clientName} onChange={v => set("clientName", v)} />
                </div>
                <Field label="Project Name" value={p.projectName} onChange={v => set("projectName", v)} />
                <Field label="Description" value={p.description} onChange={v => set("description", v)} textarea />

                <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">Status</label>
                        <select
                            value={p.status}
                            onChange={e => set("status", e.target.value as ProjectStatus)}
                            className="w-full text-sm py-2 px-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">Current Step</label>
                        <select
                            value={p.currentStep}
                            onChange={e => set("currentStep", Number(e.target.value))}
                            className="w-full text-sm py-2 px-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                            {STEPS.map((s, i) => <option key={s} value={i}>{i + 1}. {s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Progress slider */}
                <div>
                    <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">
                        Progress: <span className="font-bold text-violet-600">{p.progress}%</span>
                    </label>
                    <input
                        type="range" min={0} max={100} step={5}
                        value={p.progress}
                        onChange={e => set("progress", Number(e.target.value))}
                        className="w-full accent-violet-600"
                    />
                </div>
            </div>

            {/* Status message */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Status Message</h3>
                <Field label="Current work update" value={p.currentMessage} onChange={v => set("currentMessage", v)} textarea />
                <Field label="Next update in" value={p.nextUpdateIn} onChange={v => set("nextUpdateIn", v)} placeholder="e.g. 24 hours, 2 days" />
            </div>

            {/* Contact & files */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Contact & Files</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="WhatsApp number" value={p.whatsapp} onChange={v => set("whatsapp", v)} placeholder="8801917443161" />
                    <Field label="Email" value={p.email} onChange={v => set("email", v)} />
                </div>
                <Field label="Deliverable URL (optional)" value={p.deliverableUrl ?? ""} onChange={v => set("deliverableUrl", v)} placeholder="https://drive.google.com/..." />
            </div>

            {/* Timeline updates */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Timeline Updates</h3>
                <div className="flex gap-2">
                    <input
                        value={newUpdate}
                        onChange={e => setNewUpdate(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addUpdate()}
                        placeholder="Add new update..."
                        className="flex-1 text-sm py-2 px-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    />
                    <button onClick={addUpdate} className="px-4 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
                        Add
                    </button>
                </div>
                <div className="space-y-2">
                    {p.updates.map((upd, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#1E293B]">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-zinc-400 mb-0.5">{new Date(upd.date).toLocaleString()}</p>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300">{upd.message}</p>
                            </div>
                            <button onClick={() => removeUpdate(i)} className="text-zinc-300 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400 transition-colors shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {p.updates.length === 0 && <p className="text-xs text-zinc-400 text-center py-3">No updates yet</p>}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-[#1E3A5F] hover:border-zinc-300 transition-colors">
                    Cancel
                </button>
                <div className="flex gap-2">
                    {onDelete && (
                        <button onClick={onDelete} className="px-4 py-2.5 rounded-xl text-sm text-red-500 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onSave(p)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Save className="w-4 h-4" /> Save Project
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Reusable field ──────────────────────────────────────────── */
function Field({
    label, value, onChange, placeholder = "", textarea = false,
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; textarea?: boolean;
}) {
    const cls = "w-full text-sm py-2 px-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40";
    return (
        <div>
            <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">{label}</label>
            {textarea
                ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + " resize-none"} />
                : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
            }
        </div>
    );
}

/* ── Main Admin Page ─────────────────────────────────────────── */
export default function AdminProjectsPage() {
    const navigate = useNavigate();
    const { user } = useAdminAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        setProjects(loadProjects());
    }, []);

    const persist = (updated: Project[]) => {
        saveProjects(updated);
        setProjects(updated);
    };

    const handleSave = (p: Project) => {
        if (!p.id.trim()) { alert("Project ID is required"); return; }
        const list = [...projects];
        const idx = list.findIndex(x => x.id === p.id);
        if (idx >= 0) list[idx] = p; else list.push(p);
        persist(list);
        setEditing(null);
        setIsNew(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this project?")) return;
        persist(projects.filter(p => p.id !== id));
        setEditing(null);
    };

    /* ── Admin Dashboard ── */
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F172A] pb-16">
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-cyan-500" />

            {/* Header */}
            <header className="bg-white dark:bg-[#162032] border-b border-zinc-100 dark:border-[#1E3A5F] px-5 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/")} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-base font-semibold text-zinc-900 dark:text-white">Project Manager</h1>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/25 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">Admin</span>
                    </div>
                    <button
                        onClick={() => { setEditing(emptyProject()); setIsNew(true); }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-3.5 h-3.5" /> New Project
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-5 py-8 space-y-5">

                {/* New / Edit form */}
                {editing && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            {isNew ? "Create New Project" : `Editing: ${editing.projectName}`}
                        </h2>
                        <ProjectForm
                            initial={editing}
                            onSave={handleSave}
                            onCancel={() => { setEditing(null); setIsNew(false); }}
                            onDelete={!isNew ? () => handleDelete(editing.id) : undefined}
                        />
                    </div>
                )}

                {/* Projects list */}
                {!editing && (
                    <>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
                        {projects.length === 0 && (
                            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-10 text-center">
                                <p className="text-sm text-zinc-400">No projects yet. Create your first one!</p>
                            </div>
                        )}
                        <div className="space-y-3">
                            {projects.map(p => (
                                <div key={p.id} className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{p.projectName}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{p.clientName} · /{p.id}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{p.progress}%</span>
                                            {expanded === p.id ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                        </div>
                                    </button>

                                    {expanded === p.id && (
                                        <div className="border-t border-zinc-50 dark:border-[#1E3A5F] px-5 pb-4 pt-3 space-y-3">
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.currentMessage}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setEditing(p); setIsNew(false); }}
                                                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-[#1E3A5F] text-zinc-700 dark:text-zinc-300 hover:border-violet-400 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <a
                                                    href={`/project/${p.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-50 dark:bg-[#1E293B] text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> Preview
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
