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
  if (s === "red") return { bg: "bg-destructive/15", text: "text-destructive", border: "border-l-destructive", label: "Push Back", pill: "bg-destructive text-destructive-foreground" };
  if (s === "yellow") return { bg: "bg-warning/15", text: "text-warning-foreground", border: "border-l-warning", label: "Review", pill: "bg-warning text-warning-foreground" };
  return { bg: "bg-success/15", text: "text-success", border: "border-l-success", label: "Fair", pill: "bg-success text-success-foreground" };
};

const gradeEmoji = (grade: string) => {
  if (grade.startsWith("A")) return "😊";
  if (grade.startsWith("B")) return "🤔";
  if (grade.startsWith("C")) return "😬";
  return "😢";
};

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-success";
  if (grade.startsWith("B")) return "text-warning-foreground";
  return "text-destructive";
};

const gradeBg = (grade: string) => {
  if (grade.startsWith("A")) return "bg-success/10";
  if (grade.startsWith("B")) return "bg-warning/10";
  return "bg-destructive/10";
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
      className="flex items-center justify-center gap-3"
    >
      <span className={`text-7xl font-heading ${gradeColor(grade)}`}>{grade}</span>
      <span className="text-5xl">{gradeEmoji(grade)}</span>
    </motion.div>
  );
};

const ReportScreen = ({ report, loading, onEditDeal, onStartOver }: Props) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-6"
      >
        {/* Animation Scene */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Contract / Document */}
          <motion.div
            className="absolute w-24 h-32 bg-card border border-border rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 p-3"
            style={{ bottom: 16 }}
            animate={{
              rotate: [0, 0, -2, 2, -1, 0],
              scale: [1, 1, 0.97, 1.01, 0.99, 1],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Fake text lines */}
            <div className="w-full h-1.5 bg-muted rounded-full" />
            <div className="w-3/4 h-1.5 bg-muted rounded-full" />
            <div className="w-full h-1.5 bg-muted rounded-full" />
            <div className="w-2/3 h-1.5 bg-muted rounded-full" />
            <div className="w-full h-1.5 bg-muted rounded-full" />
            {/* "Signature" line */}
            <div className="mt-2 w-1/2 h-0.5 bg-destructive/40 rounded-full" />
          </motion.div>

          {/* Hammer */}
          {/* Hammer - pivots from bottom of handle (hand grip), swings overhand */}
          <motion.div
            className="absolute"
            style={{ top: -10, left: "50%", marginLeft: -1, transformOrigin: "bottom center" }}
            animate={{
              rotate: [-60, -60, 0, -60],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.35, 0.55, 1],
            }}
          >
            {/* Head (at top) */}
            <div className="w-10 h-6 bg-muted-foreground rounded-md shadow-md -ml-4" />
            {/* Handle (below head, going down to the "hand") */}
            <div className="w-2 h-20 bg-warning rounded-full mx-auto -mt-1" />
          </motion.div>

          {/* Impact sparks */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-destructive"
              style={{
                bottom: 48 + (i - 1) * 12,
                left: 56 + (i - 1) * 10,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: 0.4,
                delay: 0.5 + i * 0.05,
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-1">
          <span className="text-lg text-foreground font-medium">Breaking down your deal... 🔨</span>
          <p className="text-sm text-muted-foreground">Our AI is auditing every line item</p>
        </div>
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

  const leverData = [
    { label: "🏷️ Price", status: report.leverAnalysis.price.status, value: report.leverAnalysis.price.assessment, color: "bg-primary/10 border-primary/20" },
    {
      label: "🔄 Trade",
      status: report.leverAnalysis.trade.status,
      value: `${report.leverAnalysis.trade.isNegative ? "-" : "+"}$${Math.abs(report.leverAnalysis.trade.equity).toLocaleString()}`,
      color: "bg-warning/10 border-warning/20",
    },
    { label: "📊 Rate", status: report.leverAnalysis.rate.status, value: report.leverAnalysis.rate.assessment, color: "bg-success/10 border-success/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Deal Score */}
      <div className={`text-center py-8 rounded-2xl ${gradeBg(report.dealScore)}`}>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Audit Results 📋</p>
        <AnimatedScore grade={report.dealScore} />
        <p className="text-sm text-muted-foreground mt-3">
          {redCount > 0 && <span className="text-destructive font-medium">{redCount} issue{redCount > 1 ? "s" : ""} to push back on 🚩</span>}
          {redCount > 0 && yellowCount > 0 && " · "}
          {yellowCount > 0 && <span className="font-medium">{yellowCount} item{yellowCount > 1 ? "s" : ""} to review ⚠️</span>}
          {redCount === 0 && yellowCount === 0 && <span className="text-success font-medium">Clean deal — no major issues found ✅</span>}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{report.summary}</p>
      </div>

      {/* Three-Lever Summary */}
      <div className="grid grid-cols-3 gap-3">
        {leverData.map((lever, i) => {
          const c = statusColor(lever.status);
          return (
            <motion.div
              key={lever.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              className={`rounded-xl border p-3 text-center ${lever.color}`}
            >
              <p className="text-xs font-semibold mb-1">{lever.label}</p>
              <p className={`text-sm font-bold ${c.text}`}>{lever.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Line-by-Line Audit */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading text-foreground uppercase tracking-wider">📝 Line-by-Line Audit</h3>
        {report.lineItems.map((item, i) => {
          const c = statusColor(item.status);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
              className={`rounded-xl border border-border bg-card p-4 border-l-[3px] ${c.border}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">${item.amount.toLocaleString()}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${c.pill}`}>{c.label}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{item.explanation}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Negotiation Scripts */}
      {report.negotiationScripts.length > 0 && (
        <div className="space-y-3 rounded-2xl bg-primary/5 border border-primary/15 p-5">
          <h3 className="text-sm font-heading text-primary uppercase tracking-wider">🗣️ Negotiation Scripts</h3>
          {[...report.negotiationScripts]
            .sort((a, b) => {
              const amountA = report.lineItems.find((li) => li.name === a.item)?.amount ?? 0;
              const amountB = report.lineItems.find((li) => li.name === b.item)?.amount ?? 0;
              return amountB - amountA;
            })
            .map((script, i) => (
            <motion.div
              key={script.item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
              className="rounded-xl bg-card border border-primary/10 p-4"
            >
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">💬 {script.item}</p>
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
          className="rounded-2xl bg-success p-6 text-center"
        >
          <p className="text-sm text-success-foreground/80 uppercase tracking-wider mb-1">💰 Potential Savings ⬆️</p>
          <p className="text-4xl font-heading text-success-foreground">${report.potentialSavings.toLocaleString()}</p>
          <p className="text-sm text-success-foreground/70 mt-1">If all flagged items are successfully negotiated 🎉</p>
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onEditDeal}>✏️ Edit Deal</Button>
          <Button variant="outline" onClick={onStartOver}>🔄 Start Over</Button>
        </div>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="h-4 w-4 mr-1" /> Share 🔗
        </Button>
      </div>
    </motion.div>
  );
};

export default ReportScreen;
