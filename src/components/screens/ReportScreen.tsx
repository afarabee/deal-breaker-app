import { DealReport } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Printer, GitCompareArrows, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import SpeedometerGauge from "@/components/SpeedometerGauge";

interface Props {
  report: DealReport | null;
  loading: boolean;
  analysisError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onEditDeal: () => void;
  onStartOver: () => void;
  onCompare?: (mode: "same" | "different") => void;
}

const statusColor = (s: "red" | "yellow" | "green") => {
  if (s === "red") return {
    bg: "bg-destructive/15", text: "text-destructive", border: "border-l-destructive",
    label: "Push Back", pill: "bg-destructive text-destructive-foreground",
    tooltip: "This item is overpriced or a junk fee. Push back hard or ask to have it removed entirely.",
  };
  if (s === "yellow") return {
    bg: "bg-warning/15", text: "text-warning-foreground", border: "border-l-warning",
    label: "Review", pill: "bg-warning text-warning-foreground",
    tooltip: "This item may be reasonable, but you should compare pricing and negotiate before agreeing.",
  };
  return {
    bg: "bg-success/15", text: "text-success", border: "border-l-success",
    label: "Fair", pill: "bg-success text-success-foreground",
    tooltip: "This item appears fair and within normal range. No action needed.",
  };
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
  return <SpeedometerGauge grade={grade} />;
};

const ReportScreen = ({ report, loading, analysisError, errorMessage, onRetry, onEditDeal, onStartOver, onCompare }: Props) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [expandedScripts, setExpandedScripts] = useState<Set<string>>(new Set());
  const [showCompareMenu, setShowCompareMenu] = useState(false);

  // Expand first script when report loads
  useEffect(() => {
    if (report?.negotiationScripts?.length) {
      const sorted = [...report.negotiationScripts].sort((a, b) => {
        const aIsRate = a.item.toLowerCase().includes("interest") || a.item.toLowerCase().includes("rate");
        const bIsRate = b.item.toLowerCase().includes("interest") || b.item.toLowerCase().includes("rate");
        if (aIsRate && !bIsRate) return -1;
        if (!aIsRate && bIsRate) return 1;
        return 0;
      });
      setExpandedScripts(new Set(report.negotiationScripts.map(s => s.item)));
    }
  }, [report]);

  // Loading timeout — show message after 30 seconds
  useEffect(() => {
    if (!loading) {
      setShowTimeout(false);
      return;
    }
    const timer = setTimeout(() => setShowTimeout(true), 30000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-6"
      >
        {/* Animation Scene */}
        <div className="relative w-64 h-56 flex items-center justify-center">
          <motion.div
            className="absolute w-28 h-36 bg-card border border-border rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 p-3"
            style={{ bottom: 8, left: 32 }}
            animate={{
              rotate: [0, 0, -2, 2, -1, 0],
              scale: [1, 1, 0.96, 1.01, 0.99, 1],
            }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-1.5 bg-muted rounded-full" />
            <div className="w-3/4 h-1.5 bg-muted rounded-full" />
            <div className="w-full h-1.5 bg-muted rounded-full" />
            <div className="w-2/3 h-1.5 bg-muted rounded-full" />
            <div className="w-full h-1.5 bg-muted rounded-full" />
            <div className="mt-2 w-1/2 h-0.5 bg-destructive/40 rounded-full" />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ top: -16, right: 16, transformOrigin: "bottom center" }}
            animate={{ rotate: [-50, -50, 10, -50] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.35, 0.55, 1],
            }}
          >
            <div className="w-14 h-8 bg-muted-foreground rounded-md shadow-md -ml-5" />
            <div className="w-2.5 h-28 bg-warning rounded-full mx-auto -mt-1" />
          </motion.div>

          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-destructive"
              style={{
                bottom: 44 + (i - 1) * 14,
                left: 52 + (i - 1) * 12,
              }}
              animate={{
                scale: [0, 0, 1.5, 0],
                opacity: [0, 0, 1, 0],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.54, 0.6, 0.75],
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-1">
          <span className="text-lg text-foreground font-medium">Breaking down your deal...</span>
          <p className="text-sm text-muted-foreground">Our AI is auditing every line item</p>
        </div>

        {showTimeout && (
          <div className="text-center space-y-2 mt-4">
            <p className="text-sm text-warning-foreground">Taking longer than expected...</p>
            {onRetry && <Button variant="outline" onClick={onRetry}>Try Again</Button>}
          </div>
        )}
      </motion.div>
    );
  }

  // Error state
  if (analysisError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-4"
      >
        <div className="text-5xl">😔</div>
        <p className="text-lg text-foreground font-medium">Analysis failed</p>
        <p className="text-sm text-muted-foreground text-center max-w-[280px]">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
        <div className="flex gap-3 pt-2">
          {onRetry && <Button variant="success" onClick={onRetry}>Try Again</Button>}
          <Button variant="outline" onClick={onEditDeal}>Edit Deal</Button>
          <Button variant="outline" onClick={onStartOver} className="text-destructive border-destructive/30 hover:bg-destructive/10">Start Over</Button>
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
    { label: "Price", status: report.leverAnalysis.price.status, value: report.leverAnalysis.price.assessment, color: "bg-primary/10 border-primary/20" },
    {
      label: "Trade",
      status: report.leverAnalysis.trade.status,
      value: `${report.leverAnalysis.trade.isNegative ? "-" : "+"}$${Math.abs(report.leverAnalysis.trade.equity).toLocaleString()}`,
      color: "bg-warning/10 border-warning/20",
    },
    { label: "Rate", status: report.leverAnalysis.rate.status, value: report.leverAnalysis.rate.assessment, color: "bg-success/10 border-success/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className={`text-center py-6 rounded-2xl instrument-panel p-6 ${gradeBg(report.dealScore)}`}>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-instrument mb-2">Audit Results</p>
        <AnimatedScore grade={report.dealScore} />
        <p className="text-sm text-muted-foreground mt-3">
          {redCount > 0 && <span className="text-destructive font-medium">{redCount} issue{redCount > 1 ? "s" : ""} to push back on</span>}
          {redCount > 0 && yellowCount > 0 && " · "}
          {yellowCount > 0 && <span className="font-medium">{yellowCount} item{yellowCount > 1 ? "s" : ""} to review</span>}
          {redCount === 0 && yellowCount === 0 && <span className="text-success font-medium">Clean deal — no major issues found</span>}
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
              className={`rounded-xl border p-3 text-center instrument-panel ${lever.color}`}
            >
              <p className="text-xs font-instrument font-semibold mb-1">{lever.label}</p>
              <p className="text-sm font-instrument text-muted-foreground readout">{lever.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Line-by-Line Audit */}
      <div className="space-y-3">
        <h3 className="text-sm font-instrument text-foreground uppercase tracking-wider">Line-by-Line Audit</h3>
        {report.lineItems.map((item, i) => {
          const c = statusColor(item.status);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
              className={`rounded-xl border border-border instrument-panel p-4 border-l-[3px] ${c.border}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm readout text-muted-foreground">${item.amount.toLocaleString()}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold cursor-help ${c.pill}`}>{c.label}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[220px] text-xs">{c.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
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
          <h3 className="text-sm font-heading text-primary uppercase tracking-wider">Negotiation Scripts</h3>
          {[...report.negotiationScripts]
            .sort((a, b) => {
              const aIsRate = a.item.toLowerCase().includes("interest") || a.item.toLowerCase().includes("rate");
              const bIsRate = b.item.toLowerCase().includes("interest") || b.item.toLowerCase().includes("rate");
              if (aIsRate && !bIsRate) return -1;
              if (!aIsRate && bIsRate) return 1;
              const amountA = report.lineItems.find((li) => li.name === a.item)?.amount ?? 0;
              const amountB = report.lineItems.find((li) => li.name === b.item)?.amount ?? 0;
              return amountB - amountA;
            })
            .map((script, i) => {
              const isExpanded = expandedScripts.has(script.item);
              return (
                <motion.div
                  key={script.item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                  className="rounded-xl bg-card border border-primary/10 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setExpandedScripts((prev) => {
                        const next = new Set(prev);
                        if (next.has(script.item)) {
                          next.delete(script.item);
                        } else {
                          next.add(script.item);
                        }
                        return next;
                      });
                    }}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">{script.item}</p>
                    <ChevronDown className={`h-4 w-4 text-primary transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4">
                          <p className="text-sm text-foreground italic leading-relaxed">"{script.script}"</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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
          <p className="text-sm text-success-foreground/80 uppercase tracking-wider mb-1">Potential Savings</p>
          <p className="text-4xl font-heading text-success-foreground">${report.potentialSavings.toLocaleString()}</p>
          <p className="text-sm text-success-foreground/70 mt-1">If all flagged items are successfully negotiated</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 no-print">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEditDeal}>Edit Deal</Button>
          <Button variant="outline" onClick={onStartOver}>Start Over</Button>
        </div>
        <div className="flex items-center gap-2">
          {onCompare && (
            <div className="relative">
              <Button onClick={() => setShowCompareMenu(!showCompareMenu)} variant="outline" size="sm">
                <GitCompareArrows className="h-4 w-4 mr-1" /> Compare
              </Button>
              {showCompareMenu && (
                <div className="absolute bottom-full mb-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[180px]">
                  <button
                    onClick={() => { setShowCompareMenu(false); onCompare("same"); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    Same Vehicle
                    <span className="block text-xs text-muted-foreground">Keep vehicle, new numbers</span>
                  </button>
                  <button
                    onClick={() => { setShowCompareMenu(false); onCompare("different"); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    Different Vehicle
                    <span className="block text-xs text-muted-foreground">Start fresh</span>
                  </button>
                </div>
              )}
            </div>
          )}
          <Button onClick={() => window.print()} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center no-print">
        Tip: Choose "Save as PDF" in the print dialog to save a copy
      </p>
      <p className="text-[10px] text-muted-foreground/60 text-center mt-4 max-w-md mx-auto leading-relaxed no-print">
        Responses aren't financial, legal, or tax advice—consult qualified professionals and verify claims. ChatGPT can make mistakes, including editing or deleting content.
      </p>
    </motion.div>
  );
};

export default ReportScreen;
