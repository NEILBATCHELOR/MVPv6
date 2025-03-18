import { ReactNode } from "react";

export interface ShareClass {
  id: number;
  name: string;
  initialSupply: number;
  lockupPeriod: number; // in days
  whitelist: string[];
  votingRights: boolean;
  distributionRights: boolean;
  distributionPriority: number; // 1 = highest priority
  transferRestrictions: boolean;
}

export interface ValuationSchedule {
  frequency: "monthly" | "quarterly" | "biannually" | "annually" | "custom";
  method: "dcf" | "marketComparables" | "assetBased" | "custom";
  customFrequencyDays?: number;
  nextValuationDate: string;
}

export interface TokenMetadata {
  description?: string;
  category?: string;
  product?: string;
  issuanceDate?: string;
  maturityDate?: string;
  tranches?: {
    id: number;
    name: string;
    value: number;
    interestRate: number;
  }[];
  // Bond specific fields
  bondTranches?: {
    id: number;
    name: string;
    principalAmount: number;
    interestRate: number;
    maturityDate: string;
    isFixedRate: boolean;
    redemptionPenalty: number;
    minInvestment: number;
  }[];
  shareClasses?: ShareClass[];
  whitelistEnabled?: boolean;
  jurisdictionRestrictions?: string[];
  conversionRate?: number;
  // Fund & ETF specific fields
  underlyingAsset?: string;
  yieldStrategy?: string;
  minDeposit?: string;
  maxDeposit?: string;
  redemptionNoticeDays?: string;
  managementFee?: string;
  navOracleEnabled?: boolean;
  erc20ConversionRate?: string;
  // Multi-class equity specific fields
  ownerWallet?: string;
  kycRequired?: boolean;
  multiClassEnabled?: boolean;
  erc20Conversion?: boolean;
  // Private Equity specific fields
  valuationSchedule?: ValuationSchedule;
  lockupPeriod?: number;
  erc20ConversionRatio?: number;
  dividendFrequency?:
    | "quarterly"
    | "biannually"
    | "annually"
    | "onExit"
    | "custom";
  reinvestmentAllowed?: boolean;
  minimumInvestment?: number;
  votingThreshold?: number;
  // Bond specific fields
  issuerWallet?: string;
  callableAfter?: number;
  puttableAfter?: number;
}

export interface TokenTemplate {
  name: string;
  description: string;
  category: string;
  standard: string;
  defaultBlocks: {
    compliance: string[];
    features: string[];
    governance: string[];
  };
  icon: ReactNode;
  defaultMetadata?: TokenMetadata;
}

export interface Token {
  id: string;
  project_id: string;
  name: string;
  symbol: string;
  decimals: number;
  standard: string;
  blocks: {
    compliance: string[];
    features: string[];
    governance: string[];
  };
  metadata: TokenMetadata;
  status: string;
  contract_preview?: string;
  created_at: string;
  updated_at: string;
}
