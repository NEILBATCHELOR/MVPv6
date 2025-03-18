import React from "react";
import { Coins } from "lucide-react";
import { TokenTemplate } from "../types";

const BondsTemplate: TokenTemplate = {
  name: "Enhanced Bond Token",
  description:
    "Fixed income security with multiple tranches, interest payments, and maturity dates",
  category: "Bonds",
  standard: "ERC-3525 + ERC-1400",
  defaultBlocks: {
    compliance: [
      "KYC",
      "AML",
      "Accredited Investors Only",
      "Jurisdiction Restrictions",
    ],
    features: [
      "Fixed Interest",
      "Maturity Date",
      "Early Redemption",
      "Tranches",
      "Callable/Puttable",
    ],
    governance: ["Issuer Control"],
  },
  icon: <Coins className="h-8 w-8 text-emerald-600" />,
  defaultMetadata: {
    bondTranches: [
      {
        id: 1,
        name: "5-Year Bond",
        principalAmount: 500000,
        interestRate: 5.0,
        maturityDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 5),
        )
          .toISOString()
          .split("T")[0],
        isFixedRate: true,
        redemptionPenalty: 2.0,
        minInvestment: 1000,
      },
      {
        id: 2,
        name: "10-Year Bond",
        principalAmount: 500000,
        interestRate: 6.5,
        maturityDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 10),
        )
          .toISOString()
          .split("T")[0],
        isFixedRate: true,
        redemptionPenalty: 3.0,
        minInvestment: 5000,
      },
    ],
    kycRequired: true,
    whitelistEnabled: true,
    erc20ConversionRatio: 5,
    issuerWallet: "",
    callableAfter: 730, // 2 years
    puttableAfter: 1095, // 3 years
    jurisdictionRestrictions: ["US", "EU", "UK", "APAC"],
  },
};

export default BondsTemplate;
