import { VehicleInfo, DealData } from "@/types/deal";
import { MAKES_MODELS, US_STATES } from "@/data/vehicleData";
import { PRESET_A, PRESET_C, PRESET_F } from "@/data/presetDeals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface Props {
  data: VehicleInfo;
  onChange: (data: VehicleInfo) => void;
  onNext: () => void;
  onPresetSelect: (preset: DealData) => void;
}

const presets = [
  { label: "A Deal", data: PRESET_A, dotClass: "bg-emerald-500" },
  { label: "C Deal", data: PRESET_C, dotClass: "bg-amber-500" },
  { label: "F Deal", data: PRESET_F, dotClass: "bg-destructive" },
];

const VehicleInfoScreen = ({ data, onChange, onNext, onPresetSelect }: Props) => {
  const makes = Object.keys(MAKES_MODELS);
  const models = data.make ? MAKES_MODELS[data.make] || [] : [];
  const canProceed = data.condition && data.make && data.model;

  const update = (field: keyof VehicleInfo, value: string) => {
    const next = { ...data, [field]: value };
    if (field === "make") {
      next.model = "";
      next.trim = "";
    }
    onChange(next);
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
        <h2 className="text-xl font-heading text-foreground">Your Vehicle</h2>
        <p className="text-sm text-muted-foreground mt-1">Tell us about the vehicle you're looking at.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground tracking-wide">Try a sample deal →</p>
        <div className="flex gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => onPresetSelect(p.data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-input-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${p.dotClass}`} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Condition</label>
          <select
            value={data.condition}
            onChange={(e) => update("condition", e.target.value)}
            className="w-full h-10 rounded-md bg-secondary border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary"
          >
            <option value="" className="text-muted-foreground">Select</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Year</label>
          <Input
            value={data.year}
            onChange={(e) => update("year", e.target.value)}
            placeholder="e.g. 2026"
            className="bg-secondary border-input-border input-glow focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Make</label>
          <select
            value={data.make}
            onChange={(e) => update("make", e.target.value)}
            className="w-full h-10 rounded-md bg-secondary border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary"
          >
            <option value="">Select Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Model</label>
          <select
            value={data.model}
            onChange={(e) => update("model", e.target.value)}
            disabled={!data.make}
            className="w-full h-10 rounded-md bg-secondary border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trim</label>
        <Input
          value={data.trim}
          onChange={(e) => update("trim", e.target.value)}
          placeholder="e.g. XLT, Lariat, Limited"
          className="bg-secondary border-input-border input-glow focus:border-primary"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Dealership State</label>
        <select
          value={data.state}
          onChange={(e) => update("state", e.target.value)}
          className="w-full h-10 rounded-md bg-secondary border border-input-border px-3 text-sm text-foreground input-glow focus:outline-none focus:border-primary"
        >
          <option value="">Select State</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Dealership Name <span className="normal-case text-muted-foreground">(optional)</span>
        </label>
        <Input
          value={data.dealershipName}
          onChange={(e) => update("dealershipName", e.target.value)}
          placeholder="e.g. Ford of Murfreesboro"
          className="bg-secondary border-input-border input-glow focus:border-primary"
        />
      </div>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full h-12 text-base font-semibold"
      >
        Analyze My Deal →
      </Button>
    </motion.div>
  );
};

export default VehicleInfoScreen;
