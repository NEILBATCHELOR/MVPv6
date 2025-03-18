import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Types
export interface RedemptionRequest {
  id: string;
  investor_id?: string | null;
  investor_name?: string | null;
  token_amount: number;
  token_type: string;
  redemption_type: string;
  source_wallet_address: string;
  destination_wallet_address: string;
  conversion_rate: number;
  status: string;
  required_approvals: number;
  is_bulk_redemption?: boolean | null;
  investor_count?: number | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;
  rejection_timestamp?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RedemptionApprover {
  id: string;
  redemption_id: string;
  name: string;
  role: string;
  approved: boolean;
  approved_at?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

// Create a new redemption request
export const createRedemptionRequest = async (
  redemptionData: Omit<
    RedemptionRequest,
    "id" | "created_at" | "updated_at" | "status"
  > & {
    status?: string;
  },
): Promise<RedemptionRequest> => {
  try {
    const now = new Date().toISOString();
    const id = uuidv4();

    const newRedemption = {
      id,
      ...redemptionData,
      status: redemptionData.status || "pending",
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("redemption_requests")
      .insert(newRedemption)
      .select()
      .single();

    if (error) {
      console.error("Error creating redemption request:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createRedemptionRequest:", error);
    throw error;
  }
};

// Get all redemption requests
export const getRedemptionRequests = async (): Promise<RedemptionRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("redemption_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching redemption requests:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getRedemptionRequests:", error);
    throw error;
  }
};

// Get a specific redemption request
export const getRedemptionRequest = async (
  id: string,
): Promise<RedemptionRequest | null> => {
  try {
    const { data, error } = await supabase
      .from("redemption_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching redemption request with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in getRedemptionRequest for ID ${id}:`, error);
    throw error;
  }
};

// Update a redemption request
export const updateRedemptionRequest = async (
  id: string,
  updateData: Partial<
    Omit<RedemptionRequest, "id" | "created_at" | "updated_at">
  >,
): Promise<RedemptionRequest> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("redemption_requests")
      .update({
        ...updateData,
        updated_at: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating redemption request with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in updateRedemptionRequest for ID ${id}:`, error);
    throw error;
  }
};

// Delete a redemption request
export const deleteRedemptionRequest = async (id: string): Promise<void> => {
  try {
    // First delete any approvers for this redemption
    const { error: approversError } = await supabase
      .from("redemption_approvers")
      .delete()
      .eq("redemption_id", id);

    if (approversError) {
      console.error(
        `Error deleting approvers for redemption ${id}:`,
        approversError,
      );
      throw approversError;
    }

    // Then delete the redemption request
    const { error } = await supabase
      .from("redemption_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting redemption request with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteRedemptionRequest for ID ${id}:`, error);
    throw error;
  }
};

// Add an approver to a redemption request
export const addRedemptionApprover = async (
  approverData: Omit<
    RedemptionApprover,
    "id" | "created_at" | "approved" | "approved_at"
  > & {
    approved?: boolean;
    approved_at?: string | null;
  },
): Promise<RedemptionApprover> => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newApprover = {
      id,
      ...approverData,
      approved: approverData.approved || false,
      approved_at: approverData.approved_at || null,
      created_at: now,
    };

    const { data, error } = await supabase
      .from("redemption_approvers")
      .insert(newApprover)
      .select()
      .single();

    if (error) {
      console.error("Error adding redemption approver:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in addRedemptionApprover:", error);
    throw error;
  }
};

// Update an approver's status
export const updateApproverStatus = async (
  id: string,
  approved: boolean,
): Promise<RedemptionApprover> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("redemption_approvers")
      .update({
        approved,
        approved_at: approved ? now : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating approver with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in updateApproverStatus for ID ${id}:`, error);
    throw error;
  }
};

// Get all approvers for a redemption request
export const getRedemptionApprovers = async (
  redemptionId: string,
): Promise<RedemptionApprover[]> => {
  try {
    const { data, error } = await supabase
      .from("redemption_approvers")
      .select("*")
      .eq("redemption_id", redemptionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        `Error fetching approvers for redemption ${redemptionId}:`,
        error,
      );
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(
      `Error in getRedemptionApprovers for redemption ${redemptionId}:`,
      error,
    );
    throw error;
  }
};

// Check if all required approvals have been received
export const checkRedemptionApprovalStatus = async (
  redemptionId: string,
): Promise<{
  approved: boolean;
  approvalCount: number;
  requiredCount: number;
}> => {
  try {
    // Get the redemption request to check required approvals
    const { data: redemption, error: redemptionError } = await supabase
      .from("redemption_requests")
      .select("required_approvals")
      .eq("id", redemptionId)
      .single();

    if (redemptionError) {
      console.error(
        `Error fetching redemption ${redemptionId}:`,
        redemptionError,
      );
      throw redemptionError;
    }

    // Get all approvers for this redemption
    const { data: approvers, error: approversError } = await supabase
      .from("redemption_approvers")
      .select("approved")
      .eq("redemption_id", redemptionId);

    if (approversError) {
      console.error(
        `Error fetching approvers for redemption ${redemptionId}:`,
        approversError,
      );
      throw approversError;
    }

    const requiredCount = redemption?.required_approvals || 0;
    const approvalCount = approvers?.filter((a) => a.approved).length || 0;

    return {
      approved: approvalCount >= requiredCount,
      approvalCount,
      requiredCount,
    };
  } catch (error) {
    console.error(
      `Error in checkRedemptionApprovalStatus for redemption ${redemptionId}:`,
      error,
    );
    throw error;
  }
};

// Process a redemption (mark as completed after approvals)
export const processRedemption = async (
  redemptionId: string,
): Promise<RedemptionRequest> => {
  try {
    // Check if all approvals have been received
    const { approved } = await checkRedemptionApprovalStatus(redemptionId);

    if (!approved) {
      throw new Error("Not all required approvals have been received");
    }

    // Update the redemption status to completed
    const { data, error } = await supabase
      .from("redemption_requests")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", redemptionId)
      .select()
      .single();

    if (error) {
      console.error(`Error processing redemption ${redemptionId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in processRedemption for ID ${redemptionId}:`, error);
    throw error;
  }
};

// Reject a redemption request
export const rejectRedemption = async (
  redemptionId: string,
  rejectedBy: string,
  rejectionReason: string,
): Promise<RedemptionRequest> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("redemption_requests")
      .update({
        status: "rejected",
        rejected_by: rejectedBy,
        rejection_reason: rejectionReason,
        rejection_timestamp: now,
        updated_at: now,
      })
      .eq("id", redemptionId)
      .select()
      .single();

    if (error) {
      console.error(`Error rejecting redemption ${redemptionId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in rejectRedemption for ID ${redemptionId}:`, error);
    throw error;
  }
};
