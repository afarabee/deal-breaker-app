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

const DealHeader = ({ currentStep, deals = [], onHistorySelect, onHistoryDelete }: DealHeaderProps) => {
  const steps = [1, 2, 3, 4, 5];
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
      <div className="flex items-center justify-between mb-6">
        {onHistorySelect && onHistoryDelete ? (
          <DealHistoryDrawer
            deals={deals}
            onSelect={onHistorySelect}
            onDelete={onHistoryDelete}
          />
        ) : (
          <div className="w-8" />
        )}
        <img src={logoDark} alt="DealBreaker" className="h-20 hidden dark:block" />
        <img src={logoLight} alt="DealBreaker" className="h-20 dark:hidden" />
        <div className="flex items-center gap-2">
          <FeedbackDialog />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {steps.map((step) => (
          <motion.div
            key={step}
            className="h-1.5 rounded-full"
            initial={false}
            animate={{
              width: step <= currentStep ? 24 : 16,
              backgroundColor: step <= currentStep
                ? "hsl(142, 71%, 45%)"
                : "hsl(220, 13%, 87%)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>

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
