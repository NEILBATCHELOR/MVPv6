import { supabase } from "./supabase";
import { DocumentMetadata } from "./documentStorage";

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Document verification API functions
export async function verifyDocument(
  documentId: string,
): Promise<ApiResponse<DocumentMetadata>> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .update({ status: "approved", dateUpdated: new Date().toISOString() })
      .eq("id", documentId)
      .select()
      .single();

    if (error) throw error;

    // Audit logging disabled

    return { data, status: 200 };
  } catch (error) {
    console.error("Error verifying document:", error);
    return { error: "Failed to verify document", status: 500 };
  }
}

export async function rejectDocument(
  documentId: string,
  reason: string,
): Promise<ApiResponse<DocumentMetadata>> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .update({
        status: "rejected",
        rejectionReason: reason,
        dateUpdated: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select()
      .single();

    if (error) throw error;

    // Audit logging disabled

    return { data, status: 200 };
  } catch (error) {
    console.error("Error rejecting document:", error);
    return { error: "Failed to reject document", status: 500 };
  }
}

// KYC/AML status API functions
export async function updateKycStatus(
  userId: string,
  status: "pending" | "completed" | "failed",
  notes?: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("compliance_settings")
      .update({
        kyc_status: status,
        kyc_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Audit logging disabled

    return { data, status: 200 };
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return { error: "Failed to update KYC status", status: 500 };
  }
}

// Wallet activation API functions
export async function activateWallet(
  walletAddress: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("multi_sig_wallets")
      .update({
        status: "active",
        activated_at: new Date().toISOString(),
      })
      .eq("address", walletAddress)
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error activating wallet:", error);
    return { error: "Failed to activate wallet", status: 500 };
  }
}

export async function blockWallet(
  walletAddress: string,
  reason: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("multi_sig_wallets")
      .update({
        status: "blocked",
        block_reason: reason,
        blocked_at: new Date().toISOString(),
      })
      .eq("address", walletAddress)
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error blocking wallet:", error);
    return { error: "Failed to block wallet", status: 500 };
  }
}

// Workflow stage API functions
export async function updateWorkflowStage(
  stageId: string,
  status: "completed" | "in_progress" | "pending" | "error",
  completionPercentage?: number,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("workflow_stages")
      .update({
        status,
        completion_percentage: completionPercentage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", stageId)
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error updating workflow stage:", error);
    return { error: "Failed to update workflow stage", status: 500 };
  }
}

// Investor approval API functions
export async function approveInvestor(
  investorId: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("investors")
      .update({
        kyc_status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("investor_id", investorId)
      .select()
      .single();

    if (error) throw error;

    // Audit logging disabled

    return { data, status: 200 };
  } catch (error) {
    console.error("Error approving investor:", error);
    return { error: "Failed to approve investor", status: 500 };
  }
}

export async function rejectInvestor(
  investorId: string,
  reason: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("investors")
      .update({
        kyc_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("investor_id", investorId)
      .select()
      .single();

    if (error) throw error;

    // Audit logging disabled

    return { data, status: 200 };
  } catch (error) {
    console.error("Error rejecting investor:", error);
    return { error: "Failed to reject investor", status: 500 };
  }
}

// Whitelist management API functions
export async function addToWhitelist(
  address: string,
  organizationId: string,
): Promise<ApiResponse<any>> {
  try {
    // First get the current whitelist
    const { data: currentData, error: fetchError } = await supabase
      .from("whitelist_settings")
      .select("addresses")
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) throw fetchError;

    // Add the new address if it doesn't exist
    const currentAddresses = currentData.addresses || [];
    if (!currentAddresses.includes(address)) {
      const newAddresses = [...currentAddresses, address];

      const { data, error } = await supabase
        .from("whitelist_settings")
        .update({
          addresses: newAddresses,
          updated_at: new Date().toISOString(),
        })
        .eq("organization_id", organizationId)
        .select()
        .single();

      if (error) throw error;

      return { data, status: 200 };
    }

    return { data: currentData, status: 200 };
  } catch (error) {
    console.error("Error adding to whitelist:", error);
    return { error: "Failed to add address to whitelist", status: 500 };
  }
}

export async function removeFromWhitelist(
  address: string,
  organizationId: string,
): Promise<ApiResponse<any>> {
  try {
    // First get the current whitelist
    const { data: currentData, error: fetchError } = await supabase
      .from("whitelist_settings")
      .select("addresses")
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) throw fetchError;

    // Remove the address
    const currentAddresses = currentData.addresses || [];
    const newAddresses = currentAddresses.filter((addr) => addr !== address);

    const { data, error } = await supabase
      .from("whitelist_settings")
      .update({
        addresses: newAddresses,
        updated_at: new Date().toISOString(),
      })
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error removing from whitelist:", error);
    return { error: "Failed to remove address from whitelist", status: 500 };
  }
}

// Notification API functions
export async function createNotification(
  userId: string,
  type: "approval" | "request" | "milestone",
  title: string,
  description: string,
  actionRequired: boolean = false,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        description,
        date: new Date().toISOString(),
        read: false,
        action_required: actionRequired,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Failed to create notification", status: 500 };
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;

    return { data, status: 200 };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to mark notification as read", status: 500 };
  }
}
