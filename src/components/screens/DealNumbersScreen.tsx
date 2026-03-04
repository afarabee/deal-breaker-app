import { DealNumbers } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOAN_TERMS } from "@/data/vehicleData";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: DealNumbers;
  onChange: (data: DealNumbers) => void;
  onNext: () => void;
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
      className="pl-7 pr-9 bg-input border-input-border input-glow focus:border-primary"
    />
    <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
  </div>
);

const DealNumbersScreen = ({ data, onChange, onNext, onBack, onStartOver }: Props) => {
  const update = (field: keyof DealNumbers, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 card-glow rounded-xl p-5 bg-card border border-border"
    >
      <div>
        <h2 className="text-xl font-heading text-foreground">Your Deal Numbers 💵💰</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter the key numbers from your dealer worksheet. Focus on the big levers — not the monthly payment.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Selling Price (after discounts) 🏷️</label>
        <CurrencyInput value={data.sellingPrice} onChange={(v) => update("sellingPrice", v)} placeholder="97074" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trade-In Value 🔄</label>
          <CurrencyInput value={data.tradeInValue} onChange={(v) => update("tradeInValue", v)} placeholder="25000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trade Payoff 💳</label>
          <CurrencyInput value={data.tradePayoff} onChange={(v) => update("tradePayoff", v)} placeholder="28526" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Down Payment 💵</label>
        <CurrencyInput value={data.downPayment} onChange={(v) => update("downPayment", v)} placeholder="12500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Interest Rate (APR) 📊</label>
          <div className="relative">
            <Input
              value={data.interestRate}
              onChange={(e) => update("interestRate", e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="5.9"
              className="pr-9 bg-input border-input-border input-glow focus:border-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Loan Term 📆</label>
          <select
            value={data.loanTerm}
            onChange={(e) => update("loanTerm", e.target.value)}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary"
          >
            <option value="">Select</option>
            {LOAN_TERMS.map((t) => (
              <option key={t} value={t}>{t} months</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg bg-accent/50 border border-accent px-3 py-2.5">
        <p className="text-xs text-accent-foreground leading-relaxed">
          💡 <span className="font-semibold">Did you know?</span> Dealers can legally add up to 2% to your lender's rate and keep the difference. Always ask for the <span className="font-semibold">"buy rate."</span>
        </p>
      </div>

      {/* Caution Tape Warning */}
      <div className="rounded-xl overflow-hidden">
        <div className="caution-tape h-2" />
        <div className="bg-warning/20 p-4">
          <p className="text-sm font-bold text-warning-foreground text-center">
            ⚠️ Never negotiate on monthly payment! 🔑 Always negotiate on total price, trade value, and interest rate separately!
          </p>
        </div>
        <div className="caution-tape h-2" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <button onClick={onStartOver} className="text-sm text-destructive hover:text-destructive/80 font-medium">Start Over</button>
        </div>
        <Button onClick={onNext} variant="success">Next: Fees →</Button>
      </div>
    </motion.div>
  );
};

export default DealNumbersScreen;
