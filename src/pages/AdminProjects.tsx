import { useState, useEffect } from "react";
import {
    Plus, Trash2, Save, ChevronDown, ChevronUp,
    ExternalLink, FolderKanban, CalendarClock, FileText,
} from "lucide-react";
import {
    loadProjects, saveProjects, STEPS,
    type Project, type ProjectStatus
} from "@/data/projects";
import AdminLayout from "@/pages/admin/AdminLayout";
import {
    Btn, Badge, Card, Field, Input, Textarea, Select, PageHeader, EmptyState,
    Spinner,
} from "@/components/admin/ui";

const STATUS_OPTIONS: ProjectStatus[] = ["Active", "In Progress", "Completed", "On Hold"];

const statusTone: Record<ProjectStatus, "emerald" | "blue" | "amber" | "zinc"> = {
    "Active": "emerald",
    "In Progress": "blue",
    "Completed": "emerald",
    "On Hold": "zinc",
};

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
    const [saving, setSaving] = useState(false);

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

    const handleSave = () => {
        setSaving(true);
        onSave(p);
        setSaving(false);
    };

    return (
        <div className="space-y-4">
            {/* Basic info */}
            <Card className="p-5">
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-500" />
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Project Info</h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Project ID (URL slug)" required>
                            <Input value={p.id} onChange={e => set("id", e.target.value)} placeholder="e.g. novatech-001" />
                        </Field>
                        <Field label="Client Name">
                            <Input value={p.clientName} onChange={e => set("clientName", e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Project Name">
                        <Input value={p.projectName} onChange={e => set("projectName", e.target.value)} />
                    </Field>
                    <Field label="Description">
                        <Textarea rows={3} value={p.description} onChange={e => set("description", e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Status">
                            <Select value={p.status} onChange={e => set("status", e.target.value as ProjectStatus)}>
                                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </Select>
                        </Field>
                        <Field label="Current Step">
                            <Select value={p.currentStep} onChange={e => set("currentStep", Number(e.target.value))}>
                                {STEPS.map((s, i) => <option key={s} value={i}>{i + 1}. {s}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
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
            </Card>

            {/* Status message */}
            <Card className="p-5">
                <div className="mb-4 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-violet-500" />
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Status Message</h3>
                </div>
                <div className="space-y-4">
                    <Field label="Current work update">
                        <Textarea rows={3} value={p.currentMessage} onChange={e => set("currentMessage", e.target.value)} />
                    </Field>
                    <Field label="Next update in">
                        <Input value={p.nextUpdateIn} onChange={e => set("nextUpdateIn", e.target.value)} placeholder="e.g. 24 hours, 2 days" />
                    </Field>
                </div>
            </Card>

            {/* Contact & files */}
            <Card className="p-5">
                <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">Contact & Files</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="WhatsApp number">
                            <Input value={p.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="8801917443161" />
                        </Field>
                        <Field label="Email">
                            <Input value={p.email} onChange={e => set("email", e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Deliverable URL (optional)">
                        <Input value={p.deliverableUrl ?? ""} onChange={e => set("deliverableUrl", e.target.value)} placeholder="https://drive.google.com/..." />
                    </Field>
                </div>
            </Card>

            {/* Timeline updates */}
            <Card className="p-5">
                <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">Timeline Updates</h3>
                <div className="mb-4 flex gap-2">
                    <Input
                        value={newUpdate}
                        onChange={e => setNewUpdate(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addUpdate()}
                        placeholder="Add new update..."
                    />
                    <Btn variant="secondary" onClick={addUpdate}>Add</Btn>
                </div>
                <div className="space-y-2">
                    {p.updates.map((upd, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/[0.03]">
                            <div className="min-w-0 flex-1">
                                <p className="mb-0.5 text-[10px] text-zinc-400">{new Date(upd.date).toLocaleString()}</p>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300">{upd.message}</p>
                            </div>
                            <button onClick={() => removeUpdate(i)} className="shrink-0 text-zinc-300 transition-colors hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                    {p.updates.length === 0 && <p className="py-3 text-center text-xs text-zinc-400">No updates yet</p>}
                </div>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
                <div className="flex gap-2">
                    {onDelete && (
                        <Btn variant="danger" onClick={onDelete}><Trash2 className="h-4 w-4" /></Btn>
                    )}
                    <Btn onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner /> : <Save className="h-4 w-4" />} Save Project
                    </Btn>
                </div>
            </div>
        </div>
    );
}

/* ── Main Admin Page ─────────────────────────────────────────── */
export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setProjects(loadProjects());
        setLoading(false);
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

    return (
        <AdminLayout title="Projects">
            {editing ? (
                <>
                    <PageHeader
                        title={isNew ? "Create New Project" : `Editing: ${editing.projectName}`}
                        description="Track progress, milestones, and client updates."
                    />
                    <ProjectForm
                        initial={editing}
                        onSave={handleSave}
                        onCancel={() => { setEditing(null); setIsNew(false); }}
                        onDelete={!isNew ? () => handleDelete(editing.id) : undefined}
                    />
                </>
            ) : (
                <>
                    <PageHeader
                        title="Projects"
                        description="Manage client projects and keep them updated."
                        actions={
                            <Btn onClick={() => { setEditing(emptyProject()); setIsNew(true); }}>
                                <Plus className="h-4 w-4" /> New Project
                            </Btn>
                        }
                    />

                    {loading ? (
                        <Card className="flex items-center justify-center p-10"><Spinner /></Card>
                    ) : projects.length === 0 ? (
                        <Card>
                            <EmptyState
                                icon={FolderKanban}
                                title="No projects yet"
                                description='Click "New Project" to create your first one. Projects appear on the public project tracker.'
                            />
                        </Card>
                    ) : (
                        <>
                            <p className="mb-3 text-xs font-medium text-zinc-400">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
                            <Card>
                                <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
                                    {projects.map(p => (
                                        <div key={p.id} className="overflow-hidden">
                                            <button
                                                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                                                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="min-w-0">
                                                    <div className="mb-0.5 flex items-center gap-2">
                                                        <p className="truncate text-[13px] font-bold text-zinc-900 dark:text-white">{p.projectName}</p>
                                                        <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                                                    </div>
                                                    <p className="truncate font-mono text-[11px] text-zinc-400">{p.clientName} · /{p.id}</p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className="hidden w-24 sm:block">
                                                        <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                                                            <span>Progress</span>
                                                            <span>{p.progress}%</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.06]">
                                                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${p.progress}%` }} />
                                                        </div>
                                                    </div>
                                                    {expanded === p.id ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                                                </div>
                                            </button>

                                            {expanded === p.id && (
                                                <div className="space-y-3 border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-white/[0.05]">
                                                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{p.currentMessage || "No status message yet."}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Btn
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => { setEditing(p); setIsNew(false); }}
                                                        >
                                                            Edit
                                                        </Btn>
                                                        <a
                                                            href={`/project/${p.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-200 px-3 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-50 dark:border-violet-800/60 dark:text-violet-400 dark:hover:bg-violet-500/10"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" /> Preview
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </>
                    )}
                </>
            )}
        </AdminLayout>
    );
}