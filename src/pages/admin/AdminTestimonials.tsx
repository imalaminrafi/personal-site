import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Testimonial, loadTestimonials, saveTestimonials } from "@/data/testimonials";
import { Plus, Edit2, Trash2, Star, X, CheckCircle2 } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";

const empty: Testimonial = {
  id: "", clientName: "", company: "", country: "", rating: 5, review: "",
  photo: "", featured: false, published: false, createdAt: "",
};

export default function AdminTestimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setList(loadTestimonials()); }, []);

  const save = (updated: Testimonial[]) => {
    saveTestimonials(updated);
    setList(updated);
  };

  const openNew = () => setModal({ ...empty, id: `t${Date.now()}`, createdAt: new Date().toISOString() });

  const openEdit = (t: Testimonial) => setModal({ ...t });

  const deleteT = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    save(list.filter((t) => t.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const idx = list.findIndex((t) => t.id === modal.id);
    if (idx >= 0) {
      const copy = [...list];
      copy[idx] = modal;
      save(copy);
    } else {
      save([modal, ...list]);
    }
    setSaving(false);
    setModal(null);
  };

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{list.length} testimonial{list.length !== 1 ? "s" : ""}</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-4">
        {list.map((t) => (
          <div key={t.id} className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm shrink-0">
              {t.clientName.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-zinc-900 dark:text-white">{t.clientName}</span>
                {t.company && <span className="text-xs text-zinc-400">{t.company}</span>}
                {t.country && <span className="text-xs text-zinc-400">· {t.country}</span>}
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= t.rating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-600"}`} />
                ))}
                {t.featured && <span className="ml-2 text-[10px] font-bold text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded">FEATURED</span>}
                {!t.published && <span className="ml-1 text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-[#1E293B] px-1.5 py-0.5 rounded">DRAFT</span>}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1.5 line-clamp-2">{t.review}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(t)}
                className="p-2 rounded-lg text-zinc-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteT(t.id)}
                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
            <Star className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No testimonials yet</p>
            <p className="text-sm mt-1">Click "Add Testimonial" to create one.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-[#162032] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {list.find((t) => t.id === modal.id) ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Client Name</label>
                  <input value={modal.clientName} onChange={(e) => setModal({ ...modal, clientName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Company</label>
                  <input value={modal.company} onChange={(e) => setModal({ ...modal, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Country</label>
                  <input value={modal.country} onChange={(e) => setModal({ ...modal, country: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Rating (1-5)</label>
                  <div className="flex items-center gap-1 h-[38px]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setModal({ ...modal, rating: s })}
                        className={`p-1.5 rounded-lg transition-colors ${s <= modal.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}>
                        <Star className={`w-5 h-5 ${s <= modal.rating ? "fill-amber-400" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Review</label>
                <textarea value={modal.review} onChange={(e) => setModal({ ...modal, review: e.target.value })}
                  rows={4} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Client Photo</label>
                <CloudinaryUploader value={modal.photo} onChange={(url) => setModal({ ...modal, photo: url })} label="Client Photo" />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input type="checkbox" checked={modal.featured}
                    onChange={(e) => setModal({ ...modal, featured: e.target.checked })}
                    className="rounded border-zinc-300 dark:border-zinc-600" /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input type="checkbox" checked={modal.published}
                    onChange={(e) => setModal({ ...modal, published: e.target.checked })}
                    className="rounded border-zinc-300 dark:border-zinc-600" /> Published
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
