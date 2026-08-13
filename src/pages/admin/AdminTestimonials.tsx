import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Testimonial, loadTestimonials, saveTestimonials } from "@/data/testimonials";
import { Plus, Edit2, Trash2, Star, CheckCircle2 } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import {
  Btn, Badge, Card, Field, Input, Textarea, Modal, EmptyState, PageHeader, IconBtn,
} from "@/components/admin/ui";

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
      <PageHeader
        title="Testimonials"
        description="Collect and manage client feedback shown on your site."
        actions={
          <Btn onClick={openNew}><Plus className="h-4 w-4" /> Add Testimonial</Btn>
        }
      />

      {list.length === 0 ? (
        <Card>
          <EmptyState icon={Star} title="No testimonials yet" description='Click "Add Testimonial" to create one.' />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <Card key={t.id} className="flex items-start gap-4 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                {t.clientName.charAt(0) || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{t.clientName}</span>
                  {t.company && <span className="text-xs text-zinc-400">{t.company}</span>}
                  {t.country && <span className="text-xs text-zinc-400">· {t.country}</span>}
                </div>
                <div className="mt-0.5 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`} />
                  ))}
                  {t.featured && <Badge tone="violet" className="ml-2">Featured</Badge>}
                  {!t.published && <Badge tone="zinc" className="ml-1">Draft</Badge>}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{t.review}</p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <IconBtn label="Edit" tone="violet" onClick={() => openEdit(t)}><Edit2 className="h-4 w-4" /></IconBtn>
                <IconBtn label="Delete" tone="danger" onClick={() => deleteT(t.id)}><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={list.find((t) => t.id === modal.id) ? "Edit Testimonial" : "New Testimonial"}
          onClose={() => setModal(null)}
          size="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Client Name" required>
                <Input value={modal.clientName} onChange={(e) => setModal({ ...modal, clientName: e.target.value })} required />
              </Field>
              <Field label="Company">
                <Input value={modal.company} onChange={(e) => setModal({ ...modal, company: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Country">
                <Input value={modal.country} onChange={(e) => setModal({ ...modal, country: e.target.value })} />
              </Field>
              <Field label="Rating (1-5)">
                <div className="flex h-9 items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setModal({ ...modal, rating: s })}
                      className={`p-1 transition-colors ${s <= modal.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}>
                      <Star className={`h-5 w-5 ${s <= modal.rating ? "fill-amber-400" : ""}`} />
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <Field label="Review" required>
              <Textarea rows={4} value={modal.review} onChange={(e) => setModal({ ...modal, review: e.target.value })} required />
            </Field>
            <Field label="Client Photo">
              <CloudinaryUploader value={modal.photo} onChange={(url) => setModal({ ...modal, photo: url })} label="Upload client photo" />
            </Field>
            <div className="flex items-center gap-5 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={modal.featured} onChange={(e) => setModal({ ...modal, featured: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={modal.published} onChange={(e) => setModal({ ...modal, published: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Published
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Btn type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" disabled={saving}>
                {saving ? "Saving..." : <><CheckCircle2 className="h-4 w-4" /> Save</>}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}