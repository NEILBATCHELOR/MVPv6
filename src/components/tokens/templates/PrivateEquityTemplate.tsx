import React from "react";
import { Coins } from "lucide-react";
import { TokenTemplate } from "../types";

const PrivateEquityTemplate: TokenTemplate = {
  name: "Private Equity Token",
  description:
    "Token representing private equity investments with multiple share classes, governance, and distribution rights",
  category: "Private Equity",
  standard: "ERC-1400 + ERC-3643 + ERC-3525",
  defaultBlocks: {
    compliance: [
      "KYC",
      "AML",
      "Accredited Investors Only",
      "Jurisdiction Restrictions",
      "Maximum Investors",
    ],
    features: [
      "Share Classes",
      "Voting",
      "Dividends",
      "Transfer Restrictions",
      "Lockup Period",
      "Valuation Mechanism",
    ],
    governance: ["Board Approval", "Multi-Signature", "Proposal Thresholds"],
  },
  icon: <Coins className="h-8 w-8 text-indigo-600" />,
  defaultMetadata: {
    shareClasses: [
      {
        id: 1,
        name: "GP (General Partner)",
        initialSupply: 200000,
        lockupPeriod: 730, // 2 years
        whitelist: [],
        votingRights: true,
        distributionRights: true,
        distributionPriority: 2,
        transferRestrictions: true,
      },
      {
        id: 2,
        name: "LP (Limited Partner)",
        initialSupply: 800000,
        lockupPeriod: 365, // 1 year
        whitelist: [],
        votingRights: false,
        distributionRights: true,
        distributionPriority: 1,
        transferRestrictions: true,
      },
    ],
    valuationSchedule: {
      frequency: "quarterly",
      method: "dcf",
      nextValuationDate: new Date(
        new Date().setMonth(new Date().getMonth() + 3),
      )
        .toISOString()
        .split("T")[0],
    },
    kycRequired: true,
    lockupPeriod: 365,
    erc20ConversionRatio: 10,
    dividendFrequency: "quarterly",
    reinvestmentAllowed: true,
    minimumInvestment: 10000,
    votingThreshold: 5,
    whitelistEnabled: true,
    jurisdictionRestrictions: ["US", "EU", "UK", "APAC"],
  },
};

export default PrivateEquityTemplate;
