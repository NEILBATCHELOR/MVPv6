import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface RegisterUserParams {
  email: string;
  password: string;
  name: string;
  role: "issuer" | "investor" | "admin" | "compliance_officer" | "viewer";
  metadata?: Record<string, any>;
}

export interface RegisterInvestorParams {
  name: string;
  email: string;
  type: string;
  company?: string;
  country?: string;
  walletAddress?: string;
  kycStatus?: string;
  notes?: string;
}

/**
 * Service for handling authentication and user management
 */
export const authService = {
  /**
   * Register a new user in auth.users and public.users tables
   */
  async registerUser({
    email,
    password,
    name,
    role,
    metadata = {},
  }: RegisterUserParams) {
    try {
      // 1. Create the user in auth.users
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...metadata,
          },
        },
      });

      if (authError) throw authError;
      if (!authUser.user) throw new Error("Failed to create user");

      // 2. Create entry in public.users table
      const { data: publicUser, error: publicUserError } = await supabase
        .from("users")
        .insert({
          id: authUser.user.id,
          name,
          email,
          role,
          status: "active",
        })
        .select()
        .single();

      if (publicUserError) throw publicUserError;

      // 3. Add role to user_roles table
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authUser.user.id,
        role,
      });

      if (roleError) throw roleError;

      return { user: authUser.user, publicUser };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  /**
   * Register a new investor in the investors table
   */
  async registerInvestor(params: RegisterInvestorParams) {
    try {
      const { data, error } = await supabase
        .from("investors")
        .insert({
          name: params.name,
          email: params.email,
          type: params.type,
          company: params.company || null,
          wallet_address: params.walletAddress || null,
          kyc_status: params.kycStatus || "not_started",
          notes: params.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error registering investor:", error);
      throw error;
    }
  },

  /**
   * Link an auth user to an investor record
   */
  async linkUserToInvestor(userId: string, investorId: string) {
    try {
      // Update the investor record with the user ID
      const { error } = await supabase
        .from("investors")
        .update({ user_id: userId })
        .eq("investor_id", investorId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error linking user to investor:", error);
      throw error;
    }
  },

  /**
   * Update investor KYC status
   */
  async updateInvestorKYCStatus(
    investorId: string,
    status: string,
    verificationDetails?: any,
  ) {
    try {
      const { data, error } = await supabase
        .from("investors")
        .update({
          kyc_status: status,
          verification_details: verificationDetails || null,
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
        previous_status: "not_started",
        new_status: status,
        method: "onfido",
        notes: "Verification completed via Onfido",
      });

      return data;
    } catch (error) {
      console.error("Error updating investor KYC status:", error);
      throw error;
    }
  },
};
