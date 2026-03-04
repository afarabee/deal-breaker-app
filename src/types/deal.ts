export interface VehicleInfo {
  condition: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  state: string;
  dealershipName: string;
}

export interface DealNumbers {
  sellingPrice: string;
  tradeInValue: string;
  tradePayoff: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
  monthlyPayment: string;
  creditScore: string;
}

export interface CustomFee {
  id: string;
  name: string;
  amount: string;
}

export interface FeeBreakdown {
  docFee: string;
  salesTax: string;
  registration: string;
  antiTheft: string;
  extendedWarranty: string;
  gapCoverage: string;
  maintenanceContract: string;
  customFees: CustomFee[];
}

export interface DealData {
  vehicle: VehicleInfo;
  numbers: DealNumbers;
  fees: FeeBreakdown;
}

export interface LineItemEval {
  name: string;
  amount: number;
  status: "red" | "yellow" | "green";
  explanation: string;
}

export interface NegotiationScript {
  item: string;
  script: string;
}

export interface LeverAnalysis {
  price: { assessment: string; status: "red" | "yellow" | "green" };
  trade: { equity: number; isNegative: boolean; assessment: string; status: "red" | "yellow" | "green" };
  rate: { assessment: string; status: "red" | "yellow" | "green" };
}

export interface DealReport {
  dealScore: string;
  summary: string;
  lineItems: LineItemEval[];
  negotiationScripts: NegotiationScript[];
  potentialSavings: number;
  leverAnalysis: LeverAnalysis;
}

export interface SavedDeal {
  id: string;
  date: string;
  vehicle: VehicleInfo;
  numbers: DealNumbers;
  fees: FeeBreakdown;
  report: DealReport;
}
