import { FeeBreakdown, CustomFee } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: FeeBreakdown;
  onChange: (data: FeeBreakdown) => void;
  onSubmit: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const CurrencyInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      placeholder={placeholder}
      className="pl-7 bg-secondary border-input-border input-glow focus:border-primary"
    />
  </div>
);

const FeeBreakdownScreen = ({ data, onChange, onSubmit, onBack, onStartOver }: Props) => {
  const update = (field: keyof Omit<FeeBreakdown, "customFees">, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addCustomFee = () => {
    onChange({
      ...data,
      customFees: [...data.customFees, { id: crypto.randomUUID(), name: "", amount: "" }],
    });
  };

  const updateCustomFee = (id: string, field: keyof CustomFee, value: string) => {
    onChange({
      ...data,
      customFees: data.customFees.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-heading text-foreground">Fee Breakdown</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter every fee and add-on from your worksheet. This is where dealers hide profit.</p>
      </div>

      {/* Standard Fees */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Standard Fees</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Doc / Administrative Fee</label>
            <CurrencyInput value={data.docFee} onChange={(v) => update("docFee", v)} placeholder="899" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Sales Tax</label>
            <CurrencyInput value={data.salesTax} onChange={(v) => update("salesTax", v)} placeholder="4688" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Registration / Title / License</label>
            <CurrencyInput value={data.registration} onChange={(v) => update("registration", v)} placeholder="119" />
          </div>
        </div>
      </div>

      {/* Dealer Add-Ons */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Dealer Add-Ons & F&I Products</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Anti-Theft / Etch / Ikon</label>
            <CurrencyInput value={data.antiTheft} onChange={(v) => update("antiTheft", v)} placeholder="698" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Extended Warranty</label>
            <CurrencyInput value={data.extendedWarranty} onChange={(v) => update("extendedWarranty", v)} placeholder="2436" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">GAP Coverage</label>
            <CurrencyInput value={data.gapCoverage} onChange={(v) => update("gapCoverage", v)} placeholder="1200" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Maintenance Contract</label>
            <CurrencyInput value={data.maintenanceContract} onChange={(v) => update("maintenanceContract", v)} placeholder="2290" />
          </div>

          {data.customFees.map((fee) => (
            <div key={fee.id} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Fee Name</label>
                <Input
                  value={fee.name}
                  onChange={(e) => updateCustomFee(fee.id, "name", e.target.value)}
                  placeholder="e.g. Paint Protection"
                  className="bg-secondary border-input-border input-glow focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount</label>
                <CurrencyInput
                  value={fee.amount}
                  onChange={(v) => updateCustomFee(fee.id, "amount", v)}
                  placeholder="0"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addCustomFee}
            className="w-full h-10 rounded-md border-2 border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Another Fee
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack} className="border-input-border">← Back</Button>
          <button onClick={onStartOver} className="text-sm text-destructive hover:text-destructive/80 font-medium">Start Over</button>
        </div>
        <Button onClick={onSubmit} variant="success">Break This Deal 🔥</Button>
      </div>
    </motion.div>
  );
};

export default FeeBreakdownScreen;
