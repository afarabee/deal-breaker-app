import { Delete } from "lucide-react";

const formatDisplay = (val: string) => {
  if (!val) return "$0";
  const parts = val.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "$" + parts.join(".");
};

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  onDone: () => void;
  isPercentage?: boolean;
}

const NumericKeypad = ({ value, onChange, label, onDone, isPercentage }: NumericKeypadProps) => {
  const append = (digit: string) => {
    if (digit === "." && value.includes(".")) return;
    onChange(value + digit);
  };
  const backspace = () => onChange(value.slice(0, -1));
  const clear = () => onChange("");

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL"];

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium text-center">{label}</p>
      <div className="text-3xl font-heading text-foreground text-center py-4 bg-secondary rounded-lg">
        {isPercentage ? (value || "0") + "%" : formatDisplay(value)}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => key === "DEL" ? backspace() : append(key)}
            className="h-14 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xl font-semibold active:bg-primary active:text-primary-foreground transition-colors flex items-center justify-center"
          >
            {key === "DEL" ? <Delete className="h-5 w-5" /> : key}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="flex-1 h-10 rounded-lg bg-destructive/15 text-destructive text-sm font-semibold hover:bg-destructive/25 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 h-10 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:bg-success/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default NumericKeypad;
