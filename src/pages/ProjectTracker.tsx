import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    CheckCircle2, Clock, MessageCircle, Mail,
    Download, ArrowLeft, AlertCircle
} from "lucide-react";
import { getProject, STEPS, type Project } from "@/data/projects";
import { trackProjectTracker } from "@/utils/analytics";

/* ── Status badge colours ─────────────────────────────────── */
const statusStyle: Record<string, string> = {
    "Active":      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    "In Progress": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
    "Completed":   "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    "On Hold":     "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function ProjectTrackerPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null | undefined>(undefined);

    useEffect(() => {
        if (!id) { setProject(null); return; }
        const found = getProject(id);
        setProject(found ?? null);
        if (found) trackProjectTracker(id, found.title);
    }, [id]);

    /* Loading */
    if (project === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0F172A]">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    /* Not found */
    if (project === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-[#0F172A] px-6 text-center">
                <AlertCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Project not found</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
                    This project link may be incorrect or expired. Please contact us for help.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white dark:bg-[#1E293B] border border-zinc-200 dark:border-[#1E3A5F] text-zinc-700 dark:text-zinc-200 hover:border-violet-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </div>
        );
    }

    const progressPct = Math.min(100, Math.max(0, project.progress));

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F172A] pb-24">

            {/* ── Top gradient bar ── */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-cyan-500" />

            {/* ── Header ── */}
            <header className="bg-white dark:bg-[#162032] border-b border-zinc-100 dark:border-[#1E3A5F] px-5 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Home
                    </button>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">#{project.id}</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">

                {/* ════════════════════ SECTION 1: Project Header ════════════════════ */}
                <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">{project.clientName}</p>
                            <h1 className="text-xl font-semibold text-zinc-900 dark:text-white leading-snug">
                                {project.projectName}
                            </h1>
                        </div>
                        <span className={`shrink-0 mt-0.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle[project.status]}`}>
                            {project.status}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {project.description}
                    </p>
                </div>

                {/* ════════════════════ SECTION 2: Progress Tracker ════════════════════ */}
                <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Progress</h2>
                        <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                            {progressPct}%
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-zinc-100 dark:bg-[#1E293B] rounded-full mb-7 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-700"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        {STEPS.map((step, idx) => {
                            const done    = idx < project.currentStep;
                            const current = idx === project.currentStep;
                            const pending = idx > project.currentStep;

                            return (
                                <div key={step} className="flex items-center gap-3">
                                    {/* Indicator */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all
                                        ${done    ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white" : ""}
                                        ${current ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-900 bg-violet-500 text-white" : ""}
                                        ${pending ? "bg-zinc-100 dark:bg-[#1E293B] text-zinc-400 dark:text-zinc-500" : ""}
                                    `}>
                                        {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                    </div>

                                    {/* Label */}
                                    <span className={`text-sm ${
                                        current ? "font-semibold text-zinc-900 dark:text-white" :
                                        done    ? "text-zinc-500 dark:text-zinc-400 line-through" :
                                                  "text-zinc-400 dark:text-zinc-500"
                                    }`}>
                                        {step}
                                    </span>

                                    {/* Current badge */}
                                    {current && (
                                        <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/25 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                                            Current
                                        </span>
                                    )}
                                    {done && (
                                        <span className="ml-auto text-[10px] font-medium text-zinc-400 dark:text-zinc-500">Done</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ════════════════════ SECTION 3: Current Status ════════════════════ */}
                <div className="bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-900/15 dark:to-cyan-900/15 rounded-2xl border border-violet-100 dark:border-violet-800/40 p-6">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Current Status</h2>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                        {project.currentMessage}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        Next update within <span className="font-semibold text-violet-600 dark:text-violet-400 ml-1">{project.nextUpdateIn}</span>
                    </div>
                </div>

                {/* ════════════════════ SECTION 4: Update Timeline ════════════════════ */}
                <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">Update Timeline</h2>
                    <div className="relative pl-4">
                        {/* Vertical line */}
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-100 dark:bg-[#1E293B]" />

                        <div className="space-y-5">
                            {project.updates.map((upd, i) => (
                                <div key={i} className="relative">
                                    {/* Dot */}
                                    <span className={`absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                                        i === 0
                                            ? "bg-violet-500 border-violet-500"
                                            : "bg-white dark:bg-[#162032] border-zinc-200 dark:border-[#1E3A5F]"
                                    }`} />

                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-1">{formatDate(upd.date)}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{upd.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════ SECTION 5: Action Buttons ════════════════════ */}
                <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Get in Touch</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`https://wa.me/${project.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                        <a
                            href={`mailto:${project.email}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-[#1E293B] hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-semibold transition-colors"
                        >
                            <Mail className="w-4 h-4" /> Email
                        </a>
                        {project.deliverableUrl && (
                            <a
                                href={project.deliverableUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 text-sm font-semibold hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Files
                            </a>
                        )}
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 pb-4">
                    Project tracked by <span className="font-medium text-violet-500">Alamin Rafi</span> · Updated regularly
                </p>
            </main>
        </div>
    );
}
