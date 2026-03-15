import { useState } from "react";
import { VehicleInfo, DealData } from "@/types/deal";
import { MAKES_MODELS, US_STATES, TRIMS } from "@/data/vehicleData";
import { PRESET_A, PRESET_C, PRESET_F } from "@/data/presetDeals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Hammer } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: VehicleInfo;
  onChange: (data: VehicleInfo) => void;
  onNext: () => void;
  onPresetSelect: (preset: DealData) => void;
  onPresetCompare?: () => void;
}

const presets = [
  { label: "A Deal ✅", data: PRESET_A, cls: "bg-success/15 text-green-800 dark:text-green-400 border-success/30" },
  { label: "C Deal ⚠️", data: PRESET_C, cls: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700" },
  { label: "F Deal 🚩", data: PRESET_F, cls: "bg-destructive/15 text-destructive border-destructive/30" },
];

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 2;
const YEARS = Array.from({ length: maxYear - 1990 + 1 }, (_, i) => maxYear - i);

const FieldInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="relative field-glow rounded-md">
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-input border-input-border input-glow focus:border-primary pr-9"
    />
    <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
  </div>
);

const VehicleInfoScreen = ({ data, onChange, onNext, onPresetSelect, onPresetCompare }: Props) => {
  const [yearError, setYearError] = useState("");
  const [showDemos, setShowDemos] = useState(false);
  const makes = Object.keys(MAKES_MODELS);
  const models = data.make ? MAKES_MODELS[data.make] || [] : [];
  const trims = data.make && data.model ? TRIMS[data.make]?.[data.model] || [] : [];

  const update = (field: keyof VehicleInfo, value: string) => {
    const next = { ...data, [field]: value };
    if (field === "make") {
      next.model = "";
      next.trim = "";
    }
    if (field === "model") {
      next.trim = "";
    }
    if (field === "year") {
      setYearError("");
    }
    onChange(next);
  };

  const handleYearChange = (v: string) => {
    update("year", v);
  };

  const validateAndProceed = () => {
    if (data.year) {
      const yr = parseInt(data.year, 10);
      if (data.year.length !== 4 || isNaN(yr) || yr < 1990 || yr > maxYear) {
        setYearError(`Year must be between 1990 and ${maxYear}`);
        return;
      }
    }
    onNext();
  };

  const canProceed = data.condition && data.make && data.model && data.state;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 card-glow rounded-xl p-5 bg-card border border-border"
    >
      <div>
        <h2 className="text-xl font-heading text-foreground">Your Vehicle</h2>
        <p className="text-sm text-muted-foreground mt-1">Tell us about the vehicle you're looking at.</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowDemos(!showDemos)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {showDemos ? "Hide demos ↑" : "Try a demo →"}
        </button>
        {showDemos && (
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => onPresetSelect(p.data)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors hover:opacity-80 ${p.cls}`}
              >
                {p.label}
              </button>
            ))}
            {onPresetCompare && (
              <button
                onClick={onPresetCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors hover:opacity-80 bg-primary/15 text-primary border-primary/30"
              >
                Compare Deals
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Condition</label>
          <select
            value={data.condition}
            onChange={(e) => update("condition", e.target.value)}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Year</label>
          <select
            value={data.year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary"
          >
            {YEARS.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Make</label>
          <select
            value={data.make}
            onChange={(e) => update("make", e.target.value)}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary"
          >
            <option value="">Select Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Model</label>
          <select
            value={data.model}
            onChange={(e) => update("model", e.target.value)}
            disabled={!data.make}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Trim</label>
        {trims.length > 0 ? (
          <select
            value={data.trim}
            onChange={(e) => update("trim", e.target.value)}
            className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary"
          >
            <option value="">Select Trim</option>
            {trims.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        ) : (
          <FieldInput value={data.trim} onChange={(v) => update("trim", v)} placeholder="e.g. XLT, Lariat, Limited" />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">Dealership State</label>
        <select
          value={data.state}
          onChange={(e) => update("state", e.target.value)}
          className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground input-glow field-glow focus:outline-none focus:border-primary"
        >
          <option value="">Select State</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium field-label">
          Dealership Name <span className="normal-case text-muted-foreground">(optional)</span>
        </label>
        <FieldInput value={data.dealershipName} onChange={(v) => update("dealershipName", v)} placeholder="e.g. Ford of Franklin" />
      </div>

      <Button
        onClick={validateAndProceed}
        disabled={!canProceed}
        variant="success"
        className="w-full h-12 text-base font-semibold rounded-xl"
      >
        <Hammer className="h-5 w-5" /> Let's Break My Deal →
      </Button>
    </motion.div>
  );
};

export default VehicleInfoScreen;
