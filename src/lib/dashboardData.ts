import { supabase } from "./supabase";

// Types for dashboard data
export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "error";
  completionPercentage?: number;
}

export interface StatusItem {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "pending" | "attention";
  percentage?: number;
}

export interface WalletAddress {
  id: string;
  address: string;
  label: string;
}

export interface WhitelistSettings {
  enabled: boolean;
  addresses: string[];
}

export interface NotificationProps {
  id: string;
  type: "approval" | "request" | "milestone";
  title: string;
  description: string;
  date: string;
  read: boolean;
  actionRequired?: boolean;
}

export interface ComplianceData {
  kycStatus: "pending" | "completed" | "failed";
  accreditationSettings: {
    requireAccreditation: boolean;
    minimumInvestment: number;
  };
  jurisdictions: string[];
  investorCount: number;
}

// Default workflow stages when no data exists yet
const defaultWorkflowStages: WorkflowStage[] = [
  {
    id: "registration",
    name: "Registration",
    description: "Complete registration forms and initial setup",
    status: "pending",
    completionPercentage: 0,
  },
  {
    id: "document_collection",
    name: "Document Collection",
    description: "Upload required legal and compliance documents",
    status: "pending",
    completionPercentage: 0,
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Address KYC/AML and investor qualification requirements",
    status: "pending",
    completionPercentage: 0,
  },
  {
    id: "wallet_setup",
    name: "Wallet Setup",
    description: "Configure source and issuance wallets",
    status: "pending",
    completionPercentage: 0,
  },
  {
    id: "secondary_market",
    name: "Secondary Market",
    description: "Configure secondary market settings and trading rules",
    status: "pending",
    completionPercentage: 0,
  },
];

// Default empty data structures
const emptyWallets: WalletAddress[] = [];

const defaultWhitelistSettings: WhitelistSettings = {
  enabled: false,
  addresses: [],
};

const emptyNotifications: NotificationProps[] = [];

const defaultComplianceData: ComplianceData = {
  kycStatus: "not_started",
  accreditationSettings: {
    requireAccreditation: false,
    minimumInvestment: 0,
  },
  jurisdictions: [],
  investorCount: 0,
};

// Fetch workflow stages from Supabase
export const getWorkflowStages = async (
  organizationId: string = "default-org",
): Promise<WorkflowStage[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from("workflow_stages")
      .select("*")
      .eq("organization_id", organizationId)
      .order("order", { ascending: true });

    if (!error && data && data.length > 0) {
      // Transform data to match our interface
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
        completionPercentage: item.completion_percentage,
      }));
    }

    // Fall back to default stages
    return defaultWorkflowStages;
  } catch (error) {
    console.warn("Error fetching workflow stages", error);
    return defaultWorkflowStages;
  }
};

// Fetch wallet data from Supabase
export const getWalletData = async (
  organizationId: string = "default-org",
): Promise<{
  sourceWallets: WalletAddress[];
  issuanceWallets: WalletAddress[];
  whitelistSettings: WhitelistSettings;
}> => {
  try {
    // Try to fetch source wallets
    const { data: sourceData, error: sourceError } = await supabase
      .from("multi_sig_wallets")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("wallet_type", "source");

    // Try to fetch issuance wallets
    const { data: issuanceData, error: issuanceError } = await supabase
      .from("multi_sig_wallets")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("wallet_type", "issuance");

    // Try to fetch whitelist settings
    const { data: whitelistData, error: whitelistError } = await supabase
      .from("whitelist_settings")
      .select("*")
      .eq("organization_id", organizationId)
      .single();

    // Transform data if available
    const sourceWallets =
      !sourceError && sourceData
        ? sourceData.map((item: any) => ({
            id: item.id,
            address: item.address,
            label: item.label,
          }))
        : emptyWallets;

    const issuanceWallets =
      !issuanceError && issuanceData
        ? issuanceData.map((item: any) => ({
            id: item.id,
            address: item.address,
            label: item.label,
          }))
        : emptyWallets;

    const whitelistSettings =
      !whitelistError && whitelistData
        ? {
            enabled: whitelistData.enabled,
            addresses: whitelistData.addresses || [],
          }
        : defaultWhitelistSettings;

    return {
      sourceWallets,
      issuanceWallets,
      whitelistSettings,
    };
  } catch (error) {
    console.warn("Error fetching wallet data", error);
    return {
      sourceWallets: emptyWallets,
      issuanceWallets: emptyWallets,
      whitelistSettings: defaultWhitelistSettings,
    };
  }
};

// Fetch notifications from Supabase
export const getNotifications = async (
  userId: string = "default-user",
): Promise<NotificationProps[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (!error && data && data.length > 0) {
      // Transform data to match our interface
      return data.map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        date: item.date,
        read: item.read,
        actionRequired: item.action_required,
      }));
    }

    // Return empty notifications array
    return emptyNotifications;
  } catch (error) {
    console.warn("Error fetching notifications", error);
    return emptyNotifications;
  }
};

// Fetch compliance data from Supabase
export const getComplianceData = async (
  organizationId: string = "default-org",
): Promise<ComplianceData> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from("compliance_settings")
      .select("*")
      .eq("organization_id", organizationId)
      .single();

    if (!error && data) {
      return {
        kycStatus: data.kyc_status,
        accreditationSettings: {
          requireAccreditation: data.require_accreditation,
          minimumInvestment: data.minimum_investment,
        },
        jurisdictions: data.jurisdictions || [],
        investorCount: data.investor_count || 0,
      };
    }

    // Return default compliance data
    return defaultComplianceData;
  } catch (error) {
    console.warn("Error fetching compliance data", error);
    return defaultComplianceData;
  }
};
