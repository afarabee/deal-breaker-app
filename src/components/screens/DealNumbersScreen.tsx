import { useState } from "react";
import { DealNumbers } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOAN_TERMS } from "@/data/vehicleData";
import { Pencil, Info } from "lucide-react";
import { motion } from "framer-motion";
import CurrencyInput from "@/components/CurrencyInput";
import NumericKeypad from "@/components/NumericKeypad";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  data: DealNumbers;
  onChange: (data: DealNumbers) => void;
  onNext: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const CREDIT_SCORES = [
  { value: "750+", label: "Excellent (750+)" },
  { value: "700-749", label: "Good (700-749)" },
  { value: "650-699", label: "Fair (650-699)" },
  { value: "below-650", label: "Poor (below 650)" },
];

type FieldConfig = {
  key: keyof DealNumbers;
  label: string;
  placeholder: string;
  isPercentage?: boolean;
};

const RAPID_FIELDS: FieldConfig[] = [
  { key: "sellingPrice", label: "Selling Price", placeholder: "97074" },
  { key: "tradeInValue", label: "Trade-In Value", placeholder: "25000" },
  { key: "tradePayoff", label: "Trade Payoff", placeholder: "28526" },
  { key: "downPayment", label: "Down Payment", placeholder: "12500" },
  { key: "interestRate", label: "Interest Rate (APR)", placeholder: "5.9", isPercentage: true },
  { key: "monthlyPayment", label: "Monthly Payment (if quoted)", placeholder: "0" },
];

const DealNumbersScreen = ({ data, onChange, onNext, onBack, onStartOver }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rapidMode, setRapidMode] = useState(false);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const update = (field: keyof DealNumbers, value: string) => {
    onChange({ ...data, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const price = parseFloat(data.sellingPrice);
    if (!data.sellingPrice) {
      newErrors.sellingPrice = "Selling price is required";
    } else if (isNaN(price) || price < 1000 || price > 500000) {
      newErrors.sellingPrice = "Enter a price between $1,000 and $500,000";
    }

    const rate = parseFloat(data.interestRate);
    if (data.interestRate && (isNaN(rate) || rate < 0 || rate > 30)) {
      newErrors.interestRate = "Rate must be between 0% and 30%";
    }

    const down = parseFloat(data.downPayment);
    if (data.downPayment && !isNaN(down) && !isNaN(price) && down >= price) {
      newErrors.downPayment = "Down payment must be less than selling price";
    }

    const monthly = parseFloat(data.monthlyPayment);
    if (data.monthlyPayment && (isNaN(monthly) || monthly < 0)) {
      newErrors.monthlyPayment = "Enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  // Rapid entry mode
  if (rapidMode && activeFieldIndex !== null) {
    const field = RAPID_FIELDS[activeFieldIndex];
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
          isPercentage={field.isPercentage}
          doneLabel={activeFieldIndex < RAPID_FIELDS.length - 1 ? "Next" : "Done"}
          onDone={() => {
            if (activeFieldIndex < RAPID_FIELDS.length - 1) {
              setActiveFieldIndex(activeFieldIndex + 1);
            } else {
              setActiveFieldIndex(null);
            }
          }}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (activeFieldIndex > 0) {
                setActiveFieldIndex(activeFieldIndex - 1);
              } else {
                setActiveFieldIndex(null);
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Previous
          </button>
          <p className="text-xs text-muted-foreground">
            Field {activeFieldIndex + 1} of {RAPID_FIELDS.length}
          </p>
        </div>
        <button
          onClick={() => { setRapidMode(false); setActiveFieldIndex(null); }}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center pt-1"
        >
          ← Back to form
        </button>
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
        <p className="text-sm text-muted-foreground">Tap a field to enter its value with the keypad.</p>
        <div className="space-y-2">
          {RAPID_FIELDS.map((field, i) => (
            <button
              key={field.key}
              onClick={() => setActiveFieldIndex(i)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <span className="text-sm text-foreground">{field.label}</span>
              <span className="text-sm font-semibold text-foreground">
                {data[field.key]
                  ? field.isPercentage
                    ? data[field.key] + "%"
                    : "$" + Number(data[field.key]).toLocaleString()
                  : "—"}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button onClick={handleNext} variant="success">Next: Fees →</Button>
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
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-heading text-foreground">Your Deal Numbers</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Info className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Getting the Numbers</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Dealers may not hand you a worksheet. Here's how to get the numbers you need:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Ask directly:</strong> "Can I see the full breakdown of my deal before I sign?"</li>
                  <li><strong>Photograph everything:</strong> Ask to take a photo of the worksheet or buyer's order.</li>
                  <li><strong>Separate the numbers:</strong> Get the selling price BEFORE trade-in and rebates are applied.</li>
                  <li><strong>APR vs. payment:</strong> Ask for the interest rate and term as separate numbers, not just the monthly payment.</li>
                  <li><strong>If they refuse:</strong> "I just want to make sure I understand the deal. Can you walk me through each line?"</li>
                </ul>
                <p className="text-xs italic">If they won't share the breakdown, that's a red flag.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <button
          onClick={() => setRapidMode(true)}
          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 font-semibold transition-colors"
        >
          Quick Entry
        </button>
      </div>
      <p className="text-sm text-muted-foreground">Enter the key numbers from your dealer worksheet. Focus on the big levers.</p>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Selling Price (after discounts)</label>
        <CurrencyInput value={data.sellingPrice} onChange={(v) => update("sellingPrice", v)} placeholder="97074" error={errors.sellingPrice} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trade-In Value</label>
          <CurrencyInput value={data.tradeInValue} onChange={(v) => update("tradeInValue", v)} placeholder="25000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trade Payoff</label>
          <CurrencyInput value={data.tradePayoff} onChange={(v) => update("tradePayoff", v)} placeholder="28526" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Down Payment</label>
        <CurrencyInput value={data.downPayment} onChange={(v) => update("downPayment", v)} placeholder="12500" error={errors.downPayment} />
      </div>

      <div className="rounded-xl overflow-hidden">
        <div className="h-2 bg-destructive" />
        <div className="bg-destructive/20 p-4">
          <p className="text-sm font-bold text-foreground text-center">
            Dealers can legally add up to 2% to your lender's rate and pocket the difference. Always ask for the "buy rate"!
          </p>
        </div>
        <div className="h-2 bg-destructive" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Interest Rate (APR)</label>
          <div>
            <div className="relative">
              <Input
                value={data.interestRate}
                onChange={(e) => update("interestRate", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="5.9"
                className={`pr-9 bg-input border-input-border input-glow focus:border-primary ${errors.interestRate ? "border-destructive" : ""}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
            {errors.interestRate && <p className="text-xs text-destructive mt-1">{errors.interestRate}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Loan Term</label>
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

      {/* Credit Score */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Credit Score Range</label>
        <select
          value={data.creditScore}
          onChange={(e) => update("creditScore", e.target.value)}
          className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary"
        >
          <option value="">Select (optional)</option>
          {CREDIT_SCORES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Monthly Payment with warning */}
      <div className="rounded-xl overflow-hidden">
        <div className="caution-tape h-2" />
        <div className="bg-warning/20 p-4 space-y-3">
          <p className="text-sm font-bold text-warning-foreground text-center">
            Never negotiate on monthly payment! Always negotiate on total price, trade value, and interest rate separately!
          </p>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Monthly Payment (if quoted)</label>
            <CurrencyInput value={data.monthlyPayment} onChange={(v) => update("monthlyPayment", v)} placeholder="Optional" error={errors.monthlyPayment} />
            <p className="text-xs text-warning-foreground">
              We include this only to check their math. If the quoted payment doesn't match the numbers, we'll flag it.
            </p>
          </div>
        </div>
        <div className="caution-tape h-2" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <Button variant="outline" onClick={onStartOver} className="text-destructive border-destructive/30 hover:bg-destructive/10">Start Over</Button>
        </div>
        <Button onClick={handleNext} variant="success">Next: Fees →</Button>
      </div>
    </motion.div>
  );
};

export default DealNumbersScreen;
