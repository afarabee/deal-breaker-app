import { DealReport, VehicleInfo } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ComparisonDeal {
  report: DealReport;
  vehicle: VehicleInfo;
}

interface Props {
  dealA: ComparisonDeal;
  dealB: ComparisonDeal;
  onClose: () => void;
  onStartOver: () => void;
}

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

const statusPill = (s: "red" | "yellow" | "green") => {
  if (s === "red") return "bg-destructive text-destructive-foreground";
  if (s === "yellow") return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

const ComparisonView = ({ dealA, dealB, onClose, onStartOver }: Props) => {
  const vehicleLabel = (v: VehicleInfo) =>
    `${v.year} ${v.make} ${v.model}${v.trim ? " " + v.trim : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-heading text-foreground">Deal Comparison</h2>
        <p className="text-sm text-muted-foreground mt-1">Side-by-side breakdown of both deals</p>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {[dealA, dealB].map((deal, i) => (
          <div key={i} className={`text-center p-4 rounded-xl border border-border ${gradeBg(deal.report.dealScore)}`}>
            <p className="text-xs text-muted-foreground mb-1 truncate">{vehicleLabel(deal.vehicle)}</p>
            <p className={`text-4xl font-heading ${gradeColor(deal.report.dealScore)}`}>
              {deal.report.dealScore}
            </p>
          </div>
        ))}
      </div>

      {/* Savings Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {[dealA, dealB].map((deal, i) => (
          <div key={i} className="text-center p-3 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
            <p className="text-lg font-heading text-success">${deal.report.potentialSavings.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Lever Analysis Comparison */}
      <div className="space-y-2">
        <h3 className="text-sm font-heading text-foreground uppercase tracking-wider">Key Levers</h3>
        {(["price", "trade", "rate"] as const).map((lever) => (
          <div key={lever} className="grid grid-cols-2 gap-3">
            {[dealA, dealB].map((deal, i) => {
              const analysis = deal.report.leverAnalysis[lever];
              return (
                <div key={i} className="p-2 rounded-lg border border-border bg-card text-center">
                  <p className="text-xs text-muted-foreground capitalize">{lever}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusPill(analysis.status)}`}>
                    {analysis.assessment.length > 30 ? analysis.assessment.slice(0, 30) + "..." : analysis.assessment}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Red Flags Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {[dealA, dealB].map((deal, i) => {
          const reds = deal.report.lineItems.filter((li) => li.status === "red");
          const yellows = deal.report.lineItems.filter((li) => li.status === "yellow");
          return (
            <div key={i} className="p-3 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-2 text-center">Issues</p>
              <div className="space-y-1 text-center">
                {reds.length > 0 && (
                  <p className="text-xs text-destructive font-medium">{reds.length} red flag{reds.length > 1 ? "s" : ""}</p>
                )}
                {yellows.length > 0 && (
                  <p className="text-xs text-warning-foreground font-medium">{yellows.length} to review</p>
                )}
                {reds.length === 0 && yellows.length === 0 && (
                  <p className="text-xs text-success font-medium">Clean</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Line Items Side by Side */}
      <div className="space-y-2">
        <h3 className="text-sm font-heading text-foreground uppercase tracking-wider">All Line Items</h3>
        {/* Collect unique item names across both deals */}
        {(() => {
          const allNames = new Set([
            ...dealA.report.lineItems.map((li) => li.name),
            ...dealB.report.lineItems.map((li) => li.name),
          ]);
          return Array.from(allNames).map((name) => {
            const itemA = dealA.report.lineItems.find((li) => li.name === name);
            const itemB = dealB.report.lineItems.find((li) => li.name === name);
            return (
              <div key={name} className="grid grid-cols-2 gap-3">
                {[itemA, itemB].map((item, i) => (
                  <div key={i} className={`p-2 rounded-lg border border-border bg-card ${item ? "" : "opacity-30"}`}>
                    <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                    {item ? (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusPill(item.status)}`}>
                          {item.status === "red" ? "Push Back" : item.status === "yellow" ? "Review" : "Fair"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">N/A</p>
                    )}
                  </div>
                ))}
              </div>
            );
          });
        })()}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onClose}>View Deal B Report</Button>
        <Button variant="outline" onClick={onStartOver}>Start Over</Button>
      </div>
    </motion.div>
  );
};

export default ComparisonView;
