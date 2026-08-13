import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { GalleryItem, loadGallery, saveGallery, CATEGORIES } from "@/data/gallery";
import { Plus, Trash2, Images } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import {
  Btn, Card, Field, Input, Select, Modal, Badge, EmptyState, SearchInput, PageHeader,
  IconBtn,
} from "@/components/admin/ui";

const empty: GalleryItem = {
  id: "", src: "", alt: "", category: "Office", createdAt: "",
};

export default function AdminGallery() {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { setList(loadGallery()); }, []);

  const save = (updated: GalleryItem[]) => {
    saveGallery(updated);
    setList(updated);
  };

  const filtered = list.filter((item) =>
    item.alt.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () =>
    setModal({ ...empty, id: `g${Date.now()}`, createdAt: new Date().toISOString() });

  const deleteItem = (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    save(list.filter((item) => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const exists = list.find((item) => item.id === modal.id);
    if (exists) {
      save(list.map((item) => (item.id === modal.id ? modal : item)));
    } else {
      save([modal, ...list]);
    }
    setSaving(false);
    setModal(null);
  };

  return (
    <AdminLayout title="Gallery">
      <PageHeader
        title="Gallery"
        description="Manage the images shown on your public gallery page."
        actions={
          <Btn onClick={openNew}><Plus className="h-4 w-4" /> Add Item</Btn>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by alt text..." className="mb-4 w-full sm:w-72" />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Images} title="No gallery items found" description={search ? "Try a different search." : 'Click "Add Item" to upload one.'} />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-white/[0.03]">
                {item.src ? (
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Images className="h-7 w-7 text-zinc-300 dark:text-zinc-600" /></div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-zinc-900 dark:text-white">{item.alt}</p>
                  <Badge tone="violet" className="mt-1.5">{item.category}</Badge>
                </div>
                <IconBtn label="Delete item" tone="danger" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={list.find((item) => item.id === modal.id) ? "Edit Item" : "New Gallery Item"}
          onClose={() => setModal(null)}
          size="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Image">
              <CloudinaryUploader value={modal.src} onChange={(url) => setModal({ ...modal, src: url })} label="Upload gallery image" />
            </Field>
            <Field label="Alt Text" required>
              <Input value={modal.alt} onChange={(e) => setModal({ ...modal, alt: e.target.value })} required />
            </Field>
            <Field label="Category">
              <Select value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </Field>
            <div className="flex justify-end gap-2 pt-1">
              <Btn type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}