import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DealHeader from "@/components/DealHeader";
import VehicleInfoScreen from "@/components/screens/VehicleInfoScreen";
import PreEngagementScreen from "@/components/screens/PreEngagementScreen";
import DealNumbersScreen from "@/components/screens/DealNumbersScreen";
import FeeBreakdownScreen from "@/components/screens/FeeBreakdownScreen";
import ReportScreen from "@/components/screens/ReportScreen";
import ComparisonView from "@/components/ComparisonView";
import { VehicleInfo, DealNumbers, FeeBreakdown, DealData, DealReport, SavedDeal } from "@/types/deal";
import { PRESET_A, PRESET_C } from "@/data/presetDeals";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useDealHistory } from "@/hooks/useDealHistory";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const emptyVehicle: VehicleInfo = { condition: "New", year: String(new Date().getFullYear()), make: "", model: "", trim: "", state: "" };
const emptyNumbers: DealNumbers = { sellingPrice: "", tradeInValue: "", tradePayoff: "", downPayment: "", interestRate: "", loanTerm: "", monthlyPayment: "", creditScore: "" };
const emptyFees: FeeBreakdown = { docFee: "", salesTax: "", registration: "", antiTheft: "", extendedWarranty: "", gapCoverage: "", maintenanceContract: "", customFees: [] };

const Index = () => {
  // Steps: 1=Vehicle, 2=PreEngagement, 3=DealNumbers, 4=Fees, 5=Report
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicle);
  const [numbers, setNumbers] = useState<DealNumbers>(emptyNumbers);
  const [fees, setFees] = useState<FeeBreakdown>(emptyFees);
  const [report, setReport] = useState<DealReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { deals, saveDeal, deleteDeal } = useDealHistory();

  // Start Over confirmation
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false);

  // Comparison state
  const [comparisonDeal, setComparisonDeal] = useState<{ report: DealReport; vehicle: VehicleInfo } | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [viewingDealAReport, setViewingDealAReport] = useState(false);
  const [editingComparisonDeal, setEditingComparisonDeal] = useState<"A" | "B" | null>(null);

  // Store full deal data for both deals in comparison (needed for edit/swap)
  type FullDealData = { vehicle: VehicleInfo; numbers: DealNumbers; fees: FeeBreakdown; report: DealReport };
  const [comparisonDealFull, setComparisonDealFull] = useState<{ A: FullDealData | null; B: FullDealData | null }>({ A: null, B: null });
  const comparisonDealFullRef = useRef(comparisonDealFull);
  comparisonDealFullRef.current = comparisonDealFull;
  const editingRef = useRef(editingComparisonDeal);
  editingRef.current = editingComparisonDeal;

  const startOver = () => {
    setStep(1);
    setVehicle(emptyVehicle);
    setNumbers(emptyNumbers);
    setFees(emptyFees);
    setReport(null);
    setAnalysisError(false);
    setErrorMessage("");
    setComparisonDeal(null);
    setIsComparing(false);
    setShowComparison(false);
    setShowStartOverConfirm(false);
    setViewingDealAReport(false);
    setEditingComparisonDeal(null);
    setComparisonDealFull({ A: null, B: null });
  };

  const confirmStartOver = () => {
    if (step > 1) {
      setShowStartOverConfirm(true);
    } else {
      startOver();
    }
  };

  const pendingPreset = useRef<DealData | null>(null);
  const [presetComparePhase, setPresetComparePhase] = useState<"idle" | "analyzingA" | "analyzingB">("idle");

  const handlePresetSelect = (preset: DealData) => {
    setVehicle(preset.vehicle);
    setNumbers(preset.numbers);
    setFees(preset.fees);
    pendingPreset.current = preset;
    setStep(5);
    setLoading(true);
    setReport(null);
    setAnalysisError(false);
    runAnalysis(preset);
  };

  const analyzeDeal = async () => {
    setStep(5);
    setLoading(true);
    setReport(null);
    setAnalysisError(false);
    runAnalysis({ vehicle, numbers, fees });
  };

  const parseErrorMessage = (e: any): string => {
    const msg = e?.message || "";
    if (msg.includes("API key") || msg.includes("ANTHROPIC_API_KEY")) {
      return "The analysis service is not configured. Please contact support.";
    }
    if (msg.includes("rate limit") || msg.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (msg.includes("timeout") || msg.includes("network") || msg.includes("fetch")) {
      return "Network issue. Check your connection and try again.";
    }
    return "Something went wrong. Please try again.";
  };

  const runAnalysis = async (dealData: DealData) => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-deal", {
        body: dealData,
      });

      if (error) throw error;
      const reportData = data as DealReport;
      setReport(reportData);

      // Auto-save to history
      saveDeal({
        vehicle: dealData.vehicle,
        numbers: dealData.numbers,
        fees: dealData.fees,
        report: reportData,
      });

      // If comparing, handle comparison flow
      if (isComparing && comparisonDeal) {
        const editing = editingRef.current;
        const fullData = comparisonDealFullRef.current;

        if (editing === "A") {
          // We edited Deal A — update Deal A, restore Deal B as current
          setComparisonDeal({ report: reportData, vehicle: dealData.vehicle });
          setComparisonDealFull(prev => ({
            ...prev,
            A: { vehicle: dealData.vehicle, numbers: dealData.numbers, fees: dealData.fees, report: reportData },
          }));
          if (fullData.B) {
            setReport(fullData.B.report);
            setVehicle(fullData.B.vehicle);
            setNumbers(fullData.B.numbers);
            setFees(fullData.B.fees);
          }
          setEditingComparisonDeal(null);
          setShowComparison(true);
        } else if (editing === "B") {
          // We edited Deal B — update Deal B data, current report is Deal B
          setComparisonDealFull(prev => ({
            ...prev,
            B: { vehicle: dealData.vehicle, numbers: dealData.numbers, fees: dealData.fees, report: reportData },
          }));
          setEditingComparisonDeal(null);
          setShowComparison(true);
        } else {
          // Normal comparison flow (first time Deal B is analyzed)
          setComparisonDealFull(prev => ({
            ...prev,
            B: { vehicle: dealData.vehicle, numbers: dealData.numbers, fees: dealData.fees, report: reportData },
          }));
          setShowComparison(true);
        }
      }
    } catch (e: any) {
      console.error("Analysis error:", e);
      const friendly = parseErrorMessage(e);
      setErrorMessage(friendly);
      setAnalysisError(true);
      toast({
        title: "Analysis failed",
        description: friendly,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryAnalysis = () => {
    setAnalysisError(false);
    setErrorMessage("");
    setLoading(true);
    runAnalysis({ vehicle, numbers, fees });
  };

  const handlePresetCompare = async () => {
    setStep(5);
    setLoading(true);
    setReport(null);
    setAnalysisError(false);
    setPresetComparePhase("analyzingA");

    try {
      // Analyze Deal A (PRESET_A)
      const { data: dataA, error: errorA } = await supabase.functions.invoke("analyze-deal", {
        body: PRESET_A,
      });
      if (errorA) throw errorA;
      const reportA = dataA as DealReport;

      saveDeal({ vehicle: PRESET_A.vehicle, numbers: PRESET_A.numbers, fees: PRESET_A.fees, report: reportA });

      // Store Deal A as comparison deal
      setComparisonDeal({ report: reportA, vehicle: PRESET_A.vehicle });
      setComparisonDealFull({ A: { vehicle: PRESET_A.vehicle, numbers: PRESET_A.numbers, fees: PRESET_A.fees, report: reportA }, B: null });
      setIsComparing(true);
      setPresetComparePhase("analyzingB");

      // Analyze Deal B (PRESET_C)
      const { data: dataB, error: errorB } = await supabase.functions.invoke("analyze-deal", {
        body: PRESET_C,
      });
      if (errorB) throw errorB;
      const reportB = dataB as DealReport;

      saveDeal({ vehicle: PRESET_C.vehicle, numbers: PRESET_C.numbers, fees: PRESET_C.fees, report: reportB });

      // Set Deal B as current
      setVehicle(PRESET_C.vehicle);
      setNumbers(PRESET_C.numbers);
      setFees(PRESET_C.fees);
      setReport(reportB);
      setComparisonDealFull(prev => ({
        ...prev,
        B: { vehicle: PRESET_C.vehicle, numbers: PRESET_C.numbers, fees: PRESET_C.fees, report: reportB },
      }));
      setShowComparison(true);
    } catch (e: any) {
      console.error("Preset compare error:", e);
      const friendly = parseErrorMessage(e);
      setErrorMessage(friendly);
      setAnalysisError(true);
      toast({ title: "Analysis failed", description: friendly, variant: "destructive" });
    } finally {
      setLoading(false);
      setPresetComparePhase("idle");
    }
  };

  const handleCompare = (mode: "same" | "different") => {
    if (report) {
      setComparisonDeal({ report, vehicle });
      setComparisonDealFull({ A: { vehicle, numbers, fees, report }, B: null });
      setIsComparing(true);
      setReport(null);
      if (mode === "same") {
        // Keep vehicle, numbers, and fees pre-filled so user can edit what changed
        setStep(3);
      } else {
        // Reset everything for a different vehicle
        setNumbers(emptyNumbers);
        setFees(emptyFees);
        setVehicle(emptyVehicle);
        setStep(1);
      }
    }
  };

  const handleHistorySelect = (saved: SavedDeal) => {
    setVehicle(saved.vehicle);
    setNumbers(saved.numbers);
    setFees(saved.fees);
    setReport(saved.report);
    setStep(5);
    setLoading(false);
    setAnalysisError(false);
  };

  const handleViewDealAReport = () => {
    setViewingDealAReport(true);
    setShowComparison(false);
  };

  const handleBackToComparison = () => {
    setViewingDealAReport(false);
    setShowComparison(true);
  };

  const handleEditFromComparison = (deal: "A" | "B") => {
    setEditingComparisonDeal(deal);
    setShowComparison(false);
    setViewingDealAReport(false);

    if (deal === "A" && comparisonDealFull.A) {
      // Save current Deal B data before loading Deal A
      if (report) {
        setComparisonDealFull(prev => ({
          ...prev,
          B: { vehicle, numbers, fees, report },
        }));
      }
      // Load Deal A data into the form
      setVehicle(comparisonDealFull.A.vehicle);
      setNumbers(comparisonDealFull.A.numbers);
      setFees(comparisonDealFull.A.fees);
      setReport(null);
      setStep(3);
    } else if (deal === "B") {
      // Load Deal B data (may already be current, but reload from stored if available)
      if (comparisonDealFull.B) {
        setVehicle(comparisonDealFull.B.vehicle);
        setNumbers(comparisonDealFull.B.numbers);
        setFees(comparisonDealFull.B.fees);
      }
      setReport(null);
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-[420px] px-4 pb-8">
        <DealHeader
          currentStep={step}
          deals={deals}
          onHistorySelect={handleHistorySelect}
          onHistoryDelete={deleteDeal}
        />
        <main>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <VehicleInfoScreen
                key="vehicle"
                data={vehicle}
                onChange={setVehicle}
                onNext={() => {
                  if (sessionStorage.getItem("dealbreaker-skip-briefing")) {
                    setStep(3);
                  } else {
                    setStep(2);
                  }
                }}
                onPresetSelect={handlePresetSelect}
                onPresetCompare={handlePresetCompare}
              />
            )}
            {step === 2 && (
              <PreEngagementScreen
                key="preengagement"
                onReady={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <DealNumbersScreen
                key="numbers"
                data={numbers}
                onChange={setNumbers}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
                onStartOver={confirmStartOver}
              />
            )}
            {step === 4 && (
              <FeeBreakdownScreen
                key="fees"
                data={fees}
                onChange={setFees}
                onSubmit={analyzeDeal}
                onBack={() => setStep(3)}
                onStartOver={confirmStartOver}
              />
            )}
            {step === 5 && !showComparison && !viewingDealAReport && (
              <ReportScreen
                key="report"
                report={report}
                loading={loading}
                analysisError={analysisError}
                errorMessage={errorMessage}
                onRetry={retryAnalysis}
                onEditDeal={() => setStep(4)}
                onStartOver={confirmStartOver}
                onCompare={handleCompare}
              />
            )}
            {step === 5 && viewingDealAReport && comparisonDeal && (
              <motion.div key="dealA-report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4">
                  <Button variant="outline" onClick={handleBackToComparison}>
                    ← Back to Comparison
                  </Button>
                </div>
                <ReportScreen
                  report={comparisonDeal.report}
                  loading={false}
                  onEditDeal={() => {}}
                  onStartOver={confirmStartOver}
                />
              </motion.div>
            )}
            {step === 5 && showComparison && comparisonDeal && report && (
              <ComparisonView
                key="comparison"
                dealA={comparisonDeal}
                dealB={{ report, vehicle }}
                onClose={() => setShowComparison(false)}
                onViewDealA={handleViewDealAReport}
                onStartOver={confirmStartOver}
                onEditDeal={handleEditFromComparison}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      <AlertDialog open={showStartOverConfirm} onOpenChange={setShowStartOverConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start over?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your deal data. You'll need to re-enter everything.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={startOver}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, start over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
