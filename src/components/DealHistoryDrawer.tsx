import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SavedDeal } from "@/types/deal";
import { History, Trash2 } from "lucide-react";

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-success";
  if (grade.startsWith("B")) return "text-warning-foreground";
  return "text-destructive";
};

interface Props {
  deals: SavedDeal[];
  onSelect: (deal: SavedDeal) => void;
  onDelete: (id: string) => void;
}

const DealHistoryDrawer = ({ deals, onSelect, onDelete }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative"
          aria-label="Deal history"
        >
          <History className="h-4 w-4" />
          {deals.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
              {deals.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Deal History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {deals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No saved deals yet</p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onSelect(deal)}
                  className="p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(deal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-heading ${gradeColor(deal.report.dealScore)}`}>
                        {deal.report.dealScore}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                        className="p-1 rounded hover:bg-destructive/15 transition-colors"
                        aria-label="Delete deal"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DealHistoryDrawer;
