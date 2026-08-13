import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { plans as initialPlans, addons as initialAddons, maintenanceOption as initialMaint, PricingPlan, AddonOption } from "@/data/pricingData";
import { LayoutGrid, Plus, Trash2, Wrench } from "lucide-react";
import { Btn, Card, Field, Input, IconBtn, PageHeader } from "@/components/admin/ui";

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [addons, setAddons] = useState<AddonOption[]>([]);
  const [maint, setMaint] = useState(initialMaint);

  useEffect(() => {
    const savedPlans = localStorage.getItem("admin_plans");
    const savedAddons = localStorage.getItem("admin_addons");
    const savedMaint = localStorage.getItem("admin_maint");
    if (savedPlans) setPlans(JSON.parse(savedPlans)); else setPlans(initialPlans);
    if (savedAddons) setAddons(JSON.parse(savedAddons)); else setAddons(initialAddons);
    if (savedMaint) setMaint(JSON.parse(savedMaint));
  }, []);

  const savePlans = (p: PricingPlan[]) => { setPlans(p); localStorage.setItem("admin_plans", JSON.stringify(p)); };
  const saveAddons = (a: AddonOption[]) => { setAddons(a); localStorage.setItem("admin_addons", JSON.stringify(a)); };
  const saveMaint = (m: typeof maint) => { setMaint(m); localStorage.setItem("admin_maint", JSON.stringify(m)); };

  return (
    <AdminLayout title="Pricing & Add-ons">
      <PageHeader
        title="Pricing & Add-ons"
        description="Edit the pricing packages and add-on options shown in your services section."
      />

      <div className="space-y-6">
        {/* Main Packages */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <LayoutGrid className="h-4 w-4 text-violet-500" /> Core Packages
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan, idx) => (
              <Card key={plan.id} className="p-5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">{plan.name}</p>
                <p className="mb-4 text-2xl font-black text-zinc-900 dark:text-white">{plan.priceLabel}</p>
                <Field label="Price Label">
                  <Input
                    defaultValue={plan.priceLabel}
                    onBlur={(e) => {
                      const updated = [...plans];
                      updated[idx].priceLabel = e.target.value;
                      savePlans(updated);
                    }}
                  />
                </Field>
                <p className="mt-2 text-[11px] text-zinc-400">Changes save automatically.</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Plus className="h-4 w-4 text-violet-500" /> Add-ons
          </h3>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-white/[0.05]">
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Price Label</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.03]">
                  {addons.map((addon, idx) => (
                    <tr key={addon.id}>
                      <td className="px-5 py-3.5 text-sm font-medium text-zinc-900 dark:text-white">{addon.name}</td>
                      <td className="px-5 py-3.5">
                        <Input
                          className="h-8 max-w-[220px] text-sm"
                          defaultValue={addon.priceLabel}
                          onBlur={(e) => {
                            const updated = [...addons];
                            updated[idx].priceLabel = e.target.value;
                            saveAddons(updated);
                          }}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <IconBtn
                          label={`Delete ${addon.name} addon`}
                          tone="danger"
                          onClick={() => saveAddons(addons.filter((a) => a.id !== addon.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Maintenance */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Wrench className="h-4 w-4 text-violet-500" /> Maintenance Option
          </h3>
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Label">
                <Input defaultValue={maint.name} onBlur={(e) => saveMaint({ ...maint, name: e.target.value })} />
              </Field>
              <Field label="Price Info">
                <Input defaultValue={maint.priceLabel} onBlur={(e) => saveMaint({ ...maint, priceLabel: e.target.value })} />
              </Field>
            </div>
            <p className="mt-3 text-[11px] text-zinc-400">All pricing changes save automatically.</p>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}