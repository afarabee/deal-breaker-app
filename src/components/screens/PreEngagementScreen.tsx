import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, FileText, User } from "lucide-react";

interface Props {
  onReady: () => void;
  onBack: () => void;
}

const cards = [
  {
    icon: FileText,
    title: "The Dealer Worksheet",
    body: "Dealers often keep the worksheet on their side of the desk. Ask to photograph it or take notes on your phone. You need the exact numbers — selling price, trade value, interest rate, and every fee — for this tool to work.",
  },
  {
    icon: Shield,
    title: 'The "Four Square" Tactic',
    body: "Dealers may use a four-square grid to blur the lines between trade value, price, down payment, and monthly payment. This makes it hard to negotiate any single number. Focus on each number separately — that's exactly what DealBreaker does.",
  },
  {
    icon: User,
    title: "You're in Control",
    body: "You can always walk away. Use this app right at the dealership — enter numbers as you get them. If they won't share the breakdown, that's a red flag in itself.",
  },
];

const PreEngagementScreen = ({ onReady, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 card-glow rounded-xl p-5 bg-card border border-border"
    >
      <div>
        <h2 className="text-xl font-heading text-foreground">Before You Sit Down</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A few things to know before entering the finance office.
        </p>
      </div>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
            className="rounded-lg border border-border bg-secondary/50 p-4"
          >
            <div className="flex items-start gap-3">
              <card.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{card.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button variant="success" onClick={onReady}>I'm Ready →</Button>
      </div>
      <button
        onClick={() => {
          sessionStorage.setItem("dealbreaker-skip-briefing", "true");
          onReady();
        }}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
      >
        Skip this for now
      </button>
    </motion.div>
  );
};

export default PreEngagementScreen;
