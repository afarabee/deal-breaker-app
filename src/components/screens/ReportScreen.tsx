import { DealReport } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  report: DealReport | null;
  loading: boolean;
  onEditDeal: () => void;
  onStartOver: () => void;
}

const statusColor = (s: "red" | "yellow" | "green") => {
  if (s === "red") return { bg: "bg-destructive/20", text: "text-destructive", border: "border-l-destructive", label: "Push Back" };
  if (s === "yellow") return { bg: "bg-warning/20", text: "text-warning", border: "border-l-warning", label: "Review" };
  return { bg: "bg-success/20", text: "text-success", border: "border-l-success", label: "Fair" };
};

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-success";
  if (grade.startsWith("B")) return "text-warning";
  return "text-destructive";
};

const AnimatedScore = ({ grade }: { grade: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0 }}
      animate={show ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`text-7xl font-heading ${gradeColor(grade)}`}
    >
      {grade}
    </motion.div>
  );
};

const ReportScreen = ({ report, loading, onEditDeal, onStartOver }: Props) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-4"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-lg text-foreground font-medium">Analyzing your deal...</span>
        </div>
        <p className="text-sm text-muted-foreground">Our AI is reviewing every line item</p>
      </motion.div>
    );
  }

  if (!report) return null;

  const redCount = report.lineItems.filter((i) => i.status === "red").length;
  const yellowCount = report.lineItems.filter((i) => i.status === "yellow").length;

  const handleShare = async () => {
    const text = `DealBreaker Report: ${report.dealScore} — ${report.summary}\nPotential Savings: $${report.potentialSavings.toLocaleString()}`;
    if (navigator.share) {
      await navigator.share({ title: "DealBreaker Report", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Report copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Deal Score */}
      <div className="text-center py-6">
        <AnimatedScore grade={report.dealScore} />
        <p className="text-sm text-muted-foreground mt-2">
          {redCount > 0 && <span className="text-destructive">{redCount} issue{redCount > 1 ? "s" : ""} to push back on</span>}
          {redCount > 0 && yellowCount > 0 && " · "}
          {yellowCount > 0 && <span className="text-warning">{yellowCount} item{yellowCount > 1 ? "s" : ""} to review</span>}
          {redCount === 0 && yellowCount === 0 && <span className="text-success">Clean deal — no major issues found</span>}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{report.summary}</p>
      </div>

      {/* Three-Lever Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Price", status: report.leverAnalysis.price.status, value: report.leverAnalysis.price.assessment },
          {
            label: "Trade",
            status: report.leverAnalysis.trade.status,
            value: `${report.leverAnalysis.trade.isNegative ? "-" : "+"}$${Math.abs(report.leverAnalysis.trade.equity).toLocaleString()}`,
          },
          { label: "Rate", status: report.leverAnalysis.rate.status, value: report.leverAnalysis.rate.assessment },
        ].map((lever, i) => {
          const c = statusColor(lever.status);
          return (
            <motion.div
              key={lever.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              className={`rounded-lg border border-border bg-card p-3 text-center`}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{lever.label}</p>
              <p className={`text-sm font-semibold ${c.text}`}>{lever.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Line-by-Line Audit */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading text-foreground uppercase tracking-wider">Line-by-Line Audit</h3>
        {report.lineItems.map((item, i) => {
          const c = statusColor(item.status);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
              className={`rounded-lg border border-border bg-card p-4 border-l-[3px] ${c.border}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">${item.amount.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}>{c.label}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{item.explanation}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Negotiation Scripts */}
      {report.negotiationScripts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-heading text-primary uppercase tracking-wider">🗣️ Negotiation Scripts</h3>
          {report.negotiationScripts.map((script, i) => (
            <motion.div
              key={script.item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
              className="rounded-lg bg-primary/10 border border-primary/20 p-4"
            >
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">{script.item}</p>
              <p className="text-sm text-foreground italic leading-relaxed">"{script.script}"</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Potential Savings */}
      {report.potentialSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="rounded-lg p-6 text-center"
          style={{
            background: "linear-gradient(135deg, hsl(150, 100%, 39%), hsl(150, 100%, 28%))",
          }}
        >
          <p className="text-xs text-success-foreground/80 uppercase tracking-wider mb-1">Potential Savings</p>
          <p className="text-3xl font-heading text-success-foreground">${report.potentialSavings.toLocaleString()}</p>
          <p className="text-xs text-success-foreground/70 mt-1">If all flagged items are successfully negotiated</p>
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onEditDeal} className="border-input-border">← Edit Deal</Button>
          <button onClick={onStartOver} className="text-sm text-destructive hover:text-destructive/80 font-medium">Start Over</button>
        </div>
        <Button onClick={handleShare} variant="outline" className="border-input-border">
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
      </div>
    </motion.div>
  );
};

export default ReportScreen;
