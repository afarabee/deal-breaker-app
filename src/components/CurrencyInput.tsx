import { Input } from "@/components/ui/input";
import { Pencil, Mic } from "lucide-react";

const formatWithCommas = (val: string) => {
  if (!val) return "";
  const parts = val.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

interface CurrencyInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  onMicClick?: () => void;
  isListening?: boolean;
}

const CurrencyInput = ({ value, onChange, placeholder, error, onMicClick, isListening }: CurrencyInputProps) => (
  <div>
    <div className="relative field-glow rounded-md">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-instrument">$</span>
      <Input
        value={formatWithCommas(value)}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={placeholder}
        className={`pl-7 ${onMicClick ? "pr-16" : "pr-9"} bg-input border-input-border input-glow focus:border-primary font-instrument text-xs tracking-wide ${error ? "border-destructive" : ""}`}
      />
      {onMicClick && (
        <button
          type="button"
          onClick={onMicClick}
          className={`absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors ${
            isListening
              ? "text-destructive animate-pulse"
              : "text-muted-foreground/50 hover:text-primary"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
        </button>
      )}
      <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
    </div>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default CurrencyInput;
