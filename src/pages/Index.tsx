import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import DealHeader from "@/components/DealHeader";
import VehicleInfoScreen from "@/components/screens/VehicleInfoScreen";
import PreEngagementScreen from "@/components/screens/PreEngagementScreen";
import DealNumbersScreen from "@/components/screens/DealNumbersScreen";
import FeeBreakdownScreen from "@/components/screens/FeeBreakdownScreen";
import ReportScreen from "@/components/screens/ReportScreen";
import ComparisonView from "@/components/ComparisonView";
import { VehicleInfo, DealNumbers, FeeBreakdown, DealData, DealReport, SavedDeal } from "@/types/deal";
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

const emptyVehicle: VehicleInfo = { condition: "", year: "", make: "", model: "", trim: "", state: "", dealershipName: "" };
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
  };

  const confirmStartOver = () => {
    if (step > 1) {
      setShowStartOverConfirm(true);
    } else {
      startOver();
    }
  };

  const pendingPreset = useRef<DealData | null>(null);

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

      // If comparing, show comparison view
      if (isComparing && comparisonDeal) {
        setShowComparison(true);
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

  const handleCompare = () => {
    if (report) {
      setComparisonDeal({ report, vehicle });
      setIsComparing(true);
      setNumbers(emptyNumbers);
      setFees(emptyFees);
      setVehicle(emptyVehicle);
      setReport(null);
      setStep(1);
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
                onNext={() => setStep(2)}
                onPresetSelect={handlePresetSelect}
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
            {step === 5 && !showComparison && (
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
            {step === 5 && showComparison && comparisonDeal && report && (
              <ComparisonView
                key="comparison"
                dealA={comparisonDeal}
                dealB={{ report, vehicle }}
                onClose={() => setShowComparison(false)}
                onStartOver={confirmStartOver}
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
