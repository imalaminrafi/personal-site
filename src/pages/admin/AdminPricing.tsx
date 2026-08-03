import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { plans as initialPlans, addons as initialAddons, maintenanceOption as initialMaint, PricingPlan, AddonOption } from "@/data/pricingData";
import { Package, Plus, Trash2 } from "lucide-react";

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
      <div className="space-y-10">
        {/* Main Packages */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-500" /> Core Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <div key={plan.id} className="bg-white dark:bg-[#162032] p-6 rounded-2xl border border-zinc-200 dark:border-[#1E3A5F]">
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">{plan.name}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">{plan.priceLabel}</span>
                </div>
                <div className="space-y-3">
                  <label htmlFor={`price-label-${plan.id}`} className="block text-xs font-bold text-zinc-400 uppercase">Edit Price Label</label>
                  <input 
                    id={`price-label-${plan.id}`}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-100 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#162032] text-sm"
                    defaultValue={plan.priceLabel}
                    onBlur={(e) => {
                      const updated = [...plans];
                      updated[idx].priceLabel = e.target.value;
                      savePlans(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-500" /> Add-ons
            </h2>
          </div>
          <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-[#1E3A5F] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-[#1E3A5F]">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Price Label</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.03]">
                {addons.map((addon, idx) => (
                  <tr key={addon.id}>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white text-sm">{addon.name}</td>
                    <td className="px-6 py-4">
                       <label htmlFor={`addon-price-${addon.id}`} className="sr-only">Price Label for {addon.name}</label>
                       <input 
                        id={`addon-price-${addon.id}`}
                        className="px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#162032] text-sm"
                        defaultValue={addon.priceLabel}
                        onBlur={(e) => {
                          const updated = [...addons];
                          updated[idx].priceLabel = e.target.value;
                          saveAddons(updated);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => saveAddons(addons.filter(a => a.id !== addon.id))}
                        aria-label={`Delete ${addon.name} addon`}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Maintenance */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Maintenance Option</h2>
          <div className="bg-white dark:bg-[#162032] p-6 rounded-2xl border border-zinc-200 dark:border-[#1E3A5F]">
             <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="maint-name" className="block text-xs font-bold text-zinc-400 uppercase mb-2">Label</label>
                   <input id="maint-name" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#162032] border-zinc-100 dark:border-[#1E3A5F]" defaultValue={maint.name} onBlur={(e) => saveMaint({ ...maint, name: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label htmlFor="maint-price" className="block text-xs font-bold text-zinc-400 uppercase mb-2">Price Info</label>
                  <input id="maint-price" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#162032] border-zinc-100 dark:border-[#1E3A5F]" defaultValue={maint.priceLabel} onBlur={(e) => saveMaint({ ...maint, priceLabel: e.target.value })} />
                </div>
             </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
