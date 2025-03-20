import { supabase } from "@/lib/supabase";

export interface InvestorData {
  investor_id?: string;
  name: string;
  email: string;
  type: string;
  company?: string;
  wallet_address?: string;
  kyc_status?: string;
  verification_details?: any;
  notes?: string;
}

export const investorService = {
  /**
   * Create a new investor
   */
  async createInvestor(data: InvestorData) {
    try {
      const { data: investor, error } = await supabase
        .from("investors")
        .insert({
          name: data.name,
          email: data.email,
          type: data.type,
          company: data.company || null,
          wallet_address: data.wallet_address || null,
          kyc_status: data.kyc_status || "not_started",
          verification_details: data.verification_details || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return investor;
    } catch (error) {
      console.error("Error creating investor:", error);
      throw error;
    }
  },

  /**
   * Get investor by ID
   */
  async getInvestorById(investorId: string) {
    try {
      const { data, error } = await supabase
        .from("investors")
        .select("*")
        .eq("investor_id", investorId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting investor:", error);
      throw error;
    }
  },

  /**
   * Update investor
   */
  async updateInvestor(investorId: string, data: Partial<InvestorData>) {
    try {
      const { data: updatedInvestor, error } = await supabase
        .from("investors")
        .update(data)
        .eq("investor_id", investorId)
        .select()
        .single();

      if (error) throw error;
      return updatedInvestor;
    } catch (error) {
      console.error("Error updating investor:", error);
      throw error;
    }
  },

  /**
   * Update investor KYC status
   */
  async updateKYCStatus(investorId: string, status: string, details?: any) {
    try {
      const { data, error } = await supabase
        .from("investors")
        .update({
          kyc_status: status,
          verification_details: details || null,
          kyc_expiry_date:
            status === "approved"
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : null, // 1 year from now
        })
        .eq("investor_id", investorId)
        .select()
        .single();

      if (error) throw error;

      // Log the KYC screening
      await supabase.from("kyc_screening_logs").insert({
        investor_id: investorId,
        previous_status: "not_started", // This should ideally be fetched from the previous state
        new_status: status,
        method: details?.method || "manual",
        notes: details?.notes || "KYC status updated",
      });

      return data;
    } catch (error) {
      console.error("Error updating KYC status:", error);
      throw error;
    }
  },

  /**
   * Add investor to a project
   */
  async addInvestorToProject(investorId: string, projectId: string) {
    try {
      // Check if the investor is already in the project
      const { data: existingRecord, error: checkError } = await supabase
        .from("compliance_checks")
        .select("*")
        .eq("investor_id", investorId)
        .eq("project_id", projectId)
        .maybeSingle();

      if (checkError) throw checkError;

      // If the investor is not in the project, add them
      if (!existingRecord) {
        const { error } = await supabase.from("compliance_checks").insert({
          investor_id: investorId,
          project_id: projectId,
          risk_level: "low", // Default risk level
          risk_reason: "Initial assessment",
          status: "pending_approval",
        });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error("Error adding investor to project:", error);
      throw error;
    }
  },
};
