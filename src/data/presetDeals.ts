import { DealData } from "@/types/deal";

export const PRESET_A: DealData = {
  vehicle: { condition: "New", year: "2024", make: "Honda", model: "CR-V", trim: "EX-L", state: "Tennessee" },
  numbers: { sellingPrice: "35200", tradeInValue: "0", tradePayoff: "0", downPayment: "5000", interestRate: "4.9", loanTerm: "60", monthlyPayment: "", creditScore: "750+" },
  fees: { docFee: "349", salesTax: "2332", registration: "180", antiTheft: "", extendedWarranty: "", gapCoverage: "", maintenanceContract: "", customFees: [] },
};

export const PRESET_C: DealData = {
  vehicle: { condition: "New", year: "2024", make: "Ford", model: "Explorer", trim: "XLT", state: "Tennessee" },
  numbers: { sellingPrice: "46500", tradeInValue: "12000", tradePayoff: "10500", downPayment: "2000", interestRate: "7.4", loanTerm: "72", monthlyPayment: "", creditScore: "700-749" },
  fees: { docFee: "699", salesTax: "2860", registration: "220", antiTheft: "", extendedWarranty: "2400", gapCoverage: "895", maintenanceContract: "1200", customFees: [] },
};

export const PRESET_F: DealData = {
  vehicle: { condition: "Used", year: "2022", make: "Dodge", model: "Challenger", trim: "SXT", state: "Tennessee" },
  numbers: { sellingPrice: "32900", tradeInValue: "8000", tradePayoff: "14200", downPayment: "500", interestRate: "14.9", loanTerm: "84", monthlyPayment: "789", creditScore: "650-699" },
  fees: {
    docFee: "999", salesTax: "2500", registration: "220", antiTheft: "698", extendedWarranty: "3800", gapCoverage: "1200", maintenanceContract: "1800",
    customFees: [
      { id: "preset-1", name: "Paint Protection", amount: "999" },
      { id: "preset-2", name: "VIN Etching", amount: "299" },
    ],
  },
};
