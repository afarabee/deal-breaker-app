import { useState } from "react";
import { FeeBreakdown, CustomFee } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import CurrencyInput from "@/components/CurrencyInput";
import NumericKeypad from "@/components/NumericKeypad";

interface Props {
  data: FeeBreakdown;
  onChange: (data: FeeBreakdown) => void;
  onSubmit: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

type FeeField = {
  key: keyof Omit<FeeBreakdown, "customFees">;
  label: string;
  placeholder: string;
};

const STANDARD_FEES: FeeField[] = [
  { key: "docFee", label: "Doc / Administrative Fee", placeholder: "899" },
  { key: "salesTax", label: "Sales Tax", placeholder: "4688" },
  { key: "registration", label: "Registration / Title / License", placeholder: "119" },
];

const ADDON_FEES: FeeField[] = [
  { key: "antiTheft", label: "Anti-Theft / Etch / Ikon", placeholder: "698" },
  { key: "extendedWarranty", label: "Extended Warranty", placeholder: "2436" },
  { key: "gapCoverage", label: "GAP Coverage", placeholder: "1200" },
  { key: "maintenanceContract", label: "Maintenance Contract", placeholder: "2290" },
];

const ALL_FEES = [...STANDARD_FEES, ...ADDON_FEES];

const FeeBreakdownScreen = ({ data, onChange, onSubmit, onBack, onStartOver }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rapidMode, setRapidMode] = useState(false);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const update = (field: keyof Omit<FeeBreakdown, "customFees">, value: string) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    // Check all fee fields for valid positive numbers
    for (const field of ALL_FEES) {
      const val = data[field.key];
      if (val) {
        const num = parseFloat(val);
        if (isNaN(num) || num < 0) {
          newErrors[field.key] = "Enter a valid positive amount";
        }
      }
    }
    // Validate custom fees
    for (const fee of data.customFees) {
      if (fee.amount) {
        const num = parseFloat(fee.amount);
        if (isNaN(num) || num < 0) {
          newErrors[`custom-${fee.id}`] = "Enter a valid positive amount";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  // Rapid entry keypad mode
  if (rapidMode && activeFieldIndex !== null) {
    const field = ALL_FEES[activeFieldIndex];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4 card-glow rounded-xl p-5 bg-card border border-border"
      >
        <NumericKeypad
          value={data[field.key]}
          onChange={(v) => update(field.key, v)}
          label={field.label}
          onDone={() => {
            if (activeFieldIndex < ALL_FEES.length - 1) {
              setActiveFieldIndex(activeFieldIndex + 1);
            } else {
              setActiveFieldIndex(null);
            }
          }}
        />
        <p className="text-xs text-muted-foreground text-center">
          Fee {activeFieldIndex + 1} of {ALL_FEES.length}
        </p>
      </motion.div>
    );
  }

  if (rapidMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4 card-glow rounded-xl p-5 bg-card border border-border"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading text-foreground">Quick Entry</h2>
          <button
            onClick={() => setRapidMode(false)}
            className="text-xs px-3 py-1.5 rounded-full border border-primary bg-primary text-primary-foreground font-semibold"
          >
            Standard Entry
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Tap a fee to enter its value with the keypad.</p>
        <div className="space-y-2">
          {ALL_FEES.map((field, i) => (
            <button
              key={field.key}
              onClick={() => setActiveFieldIndex(i)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <span className="text-sm text-foreground">{field.label}</span>
              <span className="text-sm font-semibold text-foreground">
                {data[field.key] ? "$" + Number(data[field.key]).toLocaleString() : "—"}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={handleSubmit} variant="success" className="rounded-xl">Break This Deal</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 card-glow rounded-xl p-5 bg-card border border-border"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading text-foreground">Fee Breakdown</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter every fee and add-on from your worksheet. This is where dealers hide profit.</p>
        </div>
        <button
          onClick={() => setRapidMode(true)}
          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 font-semibold transition-colors shrink-0"
        >
          Quick Entry
        </button>
      </div>

      {/* Standard Fees */}
      <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Standard Fees</h3>
        <div className="space-y-3">
          {STANDARD_FEES.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{field.label}</label>
              <CurrencyInput value={data[field.key]} onChange={(v) => update(field.key, v)} placeholder={field.placeholder} error={errors[field.key]} />
            </div>
          ))}
        </div>
      </div>

      {/* Dealer Add-Ons */}
      <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Dealer Add-Ons & F&I Products</h3>
        <div className="space-y-3">
          {ADDON_FEES.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{field.label}</label>
              <CurrencyInput value={data[field.key]} onChange={(v) => update(field.key, v)} placeholder={field.placeholder} error={errors[field.key]} />
            </div>
          ))}

          {data.customFees.map((fee) => (
            <div key={fee.id} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Fee Name</label>
                <div className="relative">
                  <Input
                    value={fee.name}
                    onChange={(e) => updateCustomFee(fee.id, "name", e.target.value)}
                    placeholder="e.g. Paint Protection"
                    className="bg-input border-input-border input-glow focus:border-primary pr-9"
                  />
                  <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount</label>
                <CurrencyInput
                  value={fee.amount}
                  onChange={(v) => updateCustomFee(fee.id, "amount", v)}
                  placeholder="0"
                  error={errors[`custom-${fee.id}`]}
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
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <button onClick={onStartOver} className="text-sm text-destructive hover:text-destructive/80 font-medium">Start Over</button>
        </div>
        <Button onClick={handleSubmit} variant="success" className="rounded-xl">Break This Deal</Button>
      </div>
    </motion.div>
  );
};

export default FeeBreakdownScreen;
