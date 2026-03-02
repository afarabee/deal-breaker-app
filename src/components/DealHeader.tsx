import { motion } from "framer-motion";

interface DealHeaderProps {
  currentStep: number;
}

const DealHeader = ({ currentStep }: DealHeaderProps) => {
  const steps = [1, 2, 3, 4];

  return (
    <header className="py-6 px-4">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-heading tracking-tight">
          <span className="text-foreground">DEAL</span>
          <span className="text-primary">BREAKER</span>
        </h1>
      </div>
      <div className="flex items-center justify-center gap-2">
        {steps.map((step) => (
          <motion.div
            key={step}
            className="h-1.5 rounded-full"
            initial={false}
            animate={{
              width: step <= currentStep ? 32 : 20,
              backgroundColor: step <= currentStep
                ? "hsl(355, 79%, 56%)"
                : "hsl(0, 0%, 20%)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>
    </header>
  );
};

export default DealHeader;
