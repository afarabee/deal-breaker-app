import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import DealHistoryDrawer from "@/components/DealHistoryDrawer";
import FeedbackDialog from "@/components/FeedbackDialog";
import { SavedDeal } from "@/types/deal";

interface DealHeaderProps {
  currentStep: number;
  deals?: SavedDeal[];
  onHistorySelect?: (deal: SavedDeal) => void;
  onHistoryDelete?: (id: string) => void;
}

const DealHeader = ({ currentStep, deals = [], onHistorySelect, onHistoryDelete }: DealHeaderProps) => {
  const steps = [1, 2, 3, 4, 5];

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
        <div className="h-10 overflow-hidden">
          <img
            src="/db-logo.png"
            alt="DealBreaker"
            className="h-20 w-auto object-cover object-top"
          />
        </div>
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
    </header>
  );
};

export default DealHeader;
