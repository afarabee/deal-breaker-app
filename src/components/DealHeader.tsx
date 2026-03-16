import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import DealHistoryDrawer from "@/components/DealHistoryDrawer";
import FeedbackDialog from "@/components/FeedbackDialog";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { SavedDeal } from "@/types/deal";

interface DealHeaderProps {
  currentStep: number;
  deals?: SavedDeal[];
  onHistorySelect?: (deal: SavedDeal) => void;
  onHistoryDelete?: (id: string) => void;
}

const STEP_LABELS = ["VEH", "BRIEF", "NUM", "FEE", "RPT"];

const GaugeProgress = ({ currentStep }: { currentStep: number }) => {
  const totalSteps = 5;
  const cx = 100;
  const cy = 100;
  const r = 80;
  // Arc from 180° to 360° (semi-circle, bottom half)
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const totalArc = endAngle - startAngle;

  // Background arc path
  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Tick positions
  const ticks = Array.from({ length: totalSteps }, (_, i) => {
    const angle = startAngle + (totalArc / (totalSteps - 1)) * i;
    const innerR = r - 10;
    const outerR = r + 4;
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
      labelX: cx + (r + 18) * Math.cos(angle),
      labelY: cy + (r + 18) * Math.sin(angle),
      active: i < currentStep,
    };
  });

  // Needle angle
  const needleAngle = startAngle + (totalArc / (totalSteps - 1)) * (currentStep - 1);
  const needleLength = r - 20;
  const needleX = cx + needleLength * Math.cos(needleAngle);
  const needleY = cy + needleLength * Math.sin(needleAngle);

  // Progress arc end
  const progressEnd = startAngle + (totalArc / (totalSteps - 1)) * (currentStep - 1);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 10 200 110" className="w-48 h-auto" aria-label={`Step ${currentStep} of ${totalSteps}`}>
        {/* Background arc */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={arcPath(startAngle, progressEnd)}
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 4px hsl(142 71% 45% / 0.5))" }}
        />
        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.active ? "hsl(142, 71%, 45%)" : "hsl(var(--muted-foreground) / 0.3)"}
            strokeWidth={tick.active ? 2.5 : 1.5}
            strokeLinecap="round"
            style={tick.active ? { filter: "drop-shadow(0 0 3px hsl(142 71% 45% / 0.6))" } : undefined}
          />
        ))}
        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="hsl(var(--destructive))"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ x2: cx + needleLength * Math.cos(startAngle), y2: cy + needleLength * Math.sin(startAngle) }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          style={{ filter: "drop-shadow(0 0 3px hsl(0 72% 51% / 0.4))" }}
        />
        {/* Needle hub */}
        <circle cx={cx} cy={cy} r="5" fill="hsl(var(--foreground))" />
        <circle cx={cx} cy={cy} r="2.5" fill="hsl(var(--card))" />
      </svg>
      {/* Step labels */}
      <div className="flex items-center justify-between w-full max-w-[220px] -mt-1">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-[9px] font-instrument uppercase tracking-wider transition-colors ${
              i < currentStep
                ? "text-success"
                : "text-muted-foreground/50"
            }`}
            style={i < currentStep ? { textShadow: "0 0 6px hsl(142 71% 45% / 0.4)" } : undefined}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const DealHeader = ({ currentStep, deals = [], onHistorySelect, onHistoryDelete }: DealHeaderProps) => {
  const [infoPanelOpen, setInfoPanelOpen] = useState(() => {
    return sessionStorage.getItem("dealbreaker-info-dismissed") !== "true";
  });

  const toggleInfoPanel = () => {
    const next = !infoPanelOpen;
    setInfoPanelOpen(next);
    if (!next) {
      sessionStorage.setItem("dealbreaker-info-dismissed", "true");
    } else {
      sessionStorage.removeItem("dealbreaker-info-dismissed");
    }
  };

  return (
    <header className="py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        {onHistorySelect && onHistoryDelete ? (
          <DealHistoryDrawer
            deals={deals}
            onSelect={onHistorySelect}
            onDelete={onHistoryDelete}
          />
        ) : (
          <div className="w-8" />
        )}
        <img src={logoDark} alt="DealBreaker" className="h-24 hidden dark:block mix-blend-lighten" />
        <img src={logoLight} alt="DealBreaker" className="h-24 dark:hidden mix-blend-multiply" />
        <div className="flex items-center gap-2">
          <FeedbackDialog />
          <ThemeToggle />
        </div>
      </div>

      {/* Gauge progress indicator */}
      <GaugeProgress currentStep={currentStep} />

      {/* Collapsible info/disclaimer banner */}
      <div className="mt-4">
        <button
          onClick={toggleInfoPanel}
          className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
        >
          <span className="font-medium">What is DealBreaker?</span>
          {infoPanelOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        <AnimatePresence>
          {infoPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 rounded-lg bg-secondary/50 border border-border text-xs leading-relaxed space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-semibold">DealBreaker is an AI-powered car deal auditor.</span>{" "}
                  Enter your offer details and get a fairness grade, red-flag alerts, and ready-to-use negotiation scripts.
                </p>
                <div className="flex items-start gap-1.5 text-warning">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <p>
                    <span className="font-semibold">This is a TEST app.</span>{" "}
                    <span className="text-muted-foreground">AI analysis can be inaccurate. Always review results yourself.</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default DealHeader;
