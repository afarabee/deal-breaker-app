import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DealHeader from "@/components/DealHeader";
import VehicleInfoScreen from "@/components/screens/VehicleInfoScreen";
import DealNumbersScreen from "@/components/screens/DealNumbersScreen";
import FeeBreakdownScreen from "@/components/screens/FeeBreakdownScreen";
import ReportScreen from "@/components/screens/ReportScreen";
import { VehicleInfo, DealNumbers, FeeBreakdown, DealData, DealReport } from "@/types/deal";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

const emptyVehicle: VehicleInfo = { condition: "", year: "", make: "", model: "", trim: "", state: "", dealershipName: "" };
const emptyNumbers: DealNumbers = { sellingPrice: "", tradeInValue: "", tradePayoff: "", downPayment: "", interestRate: "", loanTerm: "" };
const emptyFees: FeeBreakdown = { docFee: "", salesTax: "", registration: "", antiTheft: "", extendedWarranty: "", gapCoverage: "", maintenanceContract: "", customFees: [] };

const Index = () => {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicle);
  const [numbers, setNumbers] = useState<DealNumbers>(emptyNumbers);
  const [fees, setFees] = useState<FeeBreakdown>(emptyFees);
  const [report, setReport] = useState<DealReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startOver = () => {
    setStep(1);
    setVehicle(emptyVehicle);
    setNumbers(emptyNumbers);
    setFees(emptyFees);
    setReport(null);
  };

  const pendingPreset = useRef<DealData | null>(null);

  const handlePresetSelect = (preset: DealData) => {
    setVehicle(preset.vehicle);
    setNumbers(preset.numbers);
    setFees(preset.fees);
    pendingPreset.current = preset;
    // Set step to 3 first (where analyzeDeal would normally be called from), then trigger analysis
    setStep(4);
    setLoading(true);
    setReport(null);
    runAnalysis(preset);
  };

  const analyzeDeal = async () => {
    setStep(4);
    setLoading(true);
    setReport(null);
    runAnalysis({ vehicle, numbers, fees });
  };

  const runAnalysis = async (dealData: DealData) => {

    try {
      const { data, error } = await supabase.functions.invoke("analyze-deal", {
        body: dealData,
      });

      if (error) throw error;
      setReport(data as DealReport);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast({
        title: "Analysis failed",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-[420px] px-4 pb-8">
        <DealHeader currentStep={step} />
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
              <DealNumbersScreen
                key="numbers"
                data={numbers}
                onChange={setNumbers}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                onStartOver={startOver}
              />
            )}
            {step === 3 && (
              <FeeBreakdownScreen
                key="fees"
                data={fees}
                onChange={setFees}
                onSubmit={analyzeDeal}
                onBack={() => setStep(2)}
                onStartOver={startOver}
              />
            )}
            {step === 4 && (
              <ReportScreen
                key="report"
                report={report}
                loading={loading}
                onEditDeal={() => setStep(3)}
                onStartOver={startOver}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
