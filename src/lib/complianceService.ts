import { supabase } from "./supabase";
import { ApiResponse } from "./api";

// Types for compliance data
export interface KycVerificationResult {
  userId: string;
  status: "approved" | "rejected" | "pending";
  riskScore: "low" | "medium" | "high";
  notes?: string;
  verifiedAt?: string;
}

export interface AccreditationStatus {
  userId: string;
  status: "accredited" | "non-accredited" | "pending";
  type?: string;
  verifiedAt?: string;
  expiresAt?: string;
}

export interface JurisdictionRule {
  jurisdiction: string;
  holdingPeriod?: string;
  investorLimit?: number;
  requireLocalEntity?: boolean;
  minimumInvestment?: number;
}

// KYC/AML verification functions
export async function verifyKyc(
  userId: string,
): Promise<ApiResponse<KycVerificationResult>> {
  try {
    // In a real implementation, this would call an external KYC provider API
    // For this example, we'll simulate a successful verification

    const verificationResult: KycVerificationResult = {
      userId,
      status: "approved",
      riskScore: "low",
      verifiedAt: new Date().toISOString(),
    };

    // Update the user's KYC status in the database
    const { error } = await supabase
      .from("investors")
      .update({
        kyc_status: "Completed",
        kyc_verified_at: verificationResult.verifiedAt,
        risk_score: verificationResult.riskScore,
      })
      .eq("user_id", userId);

    if (error) throw error;

    return { data: verificationResult, status: 200 };
  } catch (error) {
    console.error("Error verifying KYC:", error);
    return { error: "Failed to verify KYC", status: 500 };
  }
}

export async function checkAccreditationStatus(
  userId: string,
): Promise<ApiResponse<AccreditationStatus>> {
  try {
    // In a real implementation, this would verify accreditation documents
    // For this example, we'll simulate a successful verification

    const accreditationStatus: AccreditationStatus = {
      userId,
      status: "accredited",
      type: "high_net_worth",
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    };

    // Update the user's accreditation status in the database
    const { error } = await supabase
      .from("investors")
      .update({
        accreditation_status: accreditationStatus.status,
        accreditation_type: accreditationStatus.type,
        accreditation_verified_at: accreditationStatus.verifiedAt,
        accreditation_expires_at: accreditationStatus.expiresAt,
      })
      .eq("user_id", userId);

    if (error) throw error;

    return { data: accreditationStatus, status: 200 };
  } catch (error) {
    console.error("Error checking accreditation status:", error);
    return { error: "Failed to check accreditation status", status: 500 };
  }
}

// Jurisdiction compliance functions
export async function getJurisdictionRules(
  jurisdiction: string,
): Promise<ApiResponse<JurisdictionRule>> {
  try {
    // In a real implementation, this would fetch from a database of jurisdiction rules
    // For this example, we'll return mock data based on the jurisdiction

    let jurisdictionRule: JurisdictionRule;

    switch (jurisdiction) {
      case "united_states":
        jurisdictionRule = {
          jurisdiction: "united_states",
          holdingPeriod: "1year",
          investorLimit: 2000,
          requireLocalEntity: false,
          minimumInvestment: 10000,
        };
        break;
      case "european_union":
        jurisdictionRule = {
          jurisdiction: "european_union",
          holdingPeriod: "none",
          investorLimit: 5000,
          requireLocalEntity: true,
          minimumInvestment: 5000,
        };
        break;
      case "cayman_islands":
        jurisdictionRule = {
          jurisdiction: "cayman_islands",
          holdingPeriod: "none",
          investorLimit: 0, // No limit
          requireLocalEntity: true,
          minimumInvestment: 100000,
        };
        break;
      default:
        jurisdictionRule = {
          jurisdiction,
          holdingPeriod: "1year",
          investorLimit: 1000,
          requireLocalEntity: false,
          minimumInvestment: 10000,
        };
    }

    return { data: jurisdictionRule, status: 200 };
  } catch (error) {
    console.error("Error getting jurisdiction rules:", error);
    return { error: "Failed to get jurisdiction rules", status: 500 };
  }
}

export async function validateJurisdictionCompliance(
  jurisdiction: string,
  investorCount: number,
  minimumInvestment: number,
): Promise<ApiResponse<{ isCompliant: boolean; issues?: string[] }>> {
  try {
    const { data: rules, error } = await getJurisdictionRules(jurisdiction);

    if (error || !rules) {
      return { error: "Failed to get jurisdiction rules", status: 500 };
    }

    const issues: string[] = [];

    // Check investor limit
    if (rules.investorLimit && investorCount > rules.investorLimit) {
      issues.push(
        `Investor count (${investorCount}) exceeds jurisdiction limit (${rules.investorLimit})`,
      );
    }

    // Check minimum investment
    if (minimumInvestment < rules.minimumInvestment) {
      issues.push(
        `Minimum investment (${minimumInvestment}) is below jurisdiction requirement (${rules.minimumInvestment})`,
      );
    }

    return {
      data: {
        isCompliant: issues.length === 0,
        issues: issues.length > 0 ? issues : undefined,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error validating jurisdiction compliance:", error);
    return { error: "Failed to validate jurisdiction compliance", status: 500 };
  }
}

// Risk assessment functions
export async function calculateRiskScore(
  userId: string,
  jurisdiction: string,
  investmentAmount: number,
): Promise<
  ApiResponse<{ riskScore: "low" | "medium" | "high"; factors: string[] }>
> {
  try {
    // In a real implementation, this would use a more sophisticated risk model
    // For this example, we'll use a simple rule-based approach

    const factors: string[] = [];
    let riskPoints = 0;

    // Check jurisdiction risk
    const highRiskJurisdictions = [
      "cayman_islands",
      "british_virgin_islands",
      "bahamas",
    ];
    const mediumRiskJurisdictions = [
      "singapore",
      "hong_kong",
      "united_arab_emirates",
    ];

    if (highRiskJurisdictions.includes(jurisdiction)) {
      riskPoints += 3;
      factors.push("High-risk jurisdiction");
    } else if (mediumRiskJurisdictions.includes(jurisdiction)) {
      riskPoints += 2;
      factors.push("Medium-risk jurisdiction");
    }

    // Check investment amount risk
    if (investmentAmount > 1000000) {
      riskPoints += 2;
      factors.push("Large investment amount");
    } else if (investmentAmount > 500000) {
      riskPoints += 1;
      factors.push("Significant investment amount");
    }

    // Determine final risk score
    let riskScore: "low" | "medium" | "high" = "low";
    if (riskPoints >= 4) {
      riskScore = "high";
    } else if (riskPoints >= 2) {
      riskScore = "medium";
    }

    // Update the user's risk score in the database
    const { error } = await supabase
      .from("investors")
      .update({
        risk_score: riskScore,
        risk_factors: factors,
      })
      .eq("user_id", userId);

    if (error) throw error;

    return {
      data: {
        riskScore,
        factors,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error calculating risk score:", error);
    return { error: "Failed to calculate risk score", status: 500 };
  }
}
