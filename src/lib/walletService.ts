import { supabase } from "./supabase";
import { ApiResponse } from "./api";

// Types for wallet data
export interface WalletStatus {
  address: string;
  status: "pending" | "active" | "blocked";
  activatedAt?: string;
  blockedAt?: string;
  blockReason?: string;
}

export interface SignatoryInfo {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  role: string;
  status: "pending" | "active";
}

export interface WhitelistEntry {
  address: string;
  label?: string;
  addedAt: string;
  addedBy?: string;
}

// Wallet activation functions
export async function getWalletStatus(
  walletAddress: string,
): Promise<ApiResponse<WalletStatus>> {
  try {
    const { data, error } = await supabase
      .from("multi_sig_wallets")
      .select("address, status, activated_at, blocked_at, block_reason")
      .eq("address", walletAddress)
      .single();

    if (error) throw error;

    const walletStatus: WalletStatus = {
      address: data.address,
      status: data.status,
      activatedAt: data.activated_at,
      blockedAt: data.blocked_at,
      blockReason: data.block_reason,
    };

    return { data: walletStatus, status: 200 };
  } catch (error) {
    console.error("Error getting wallet status:", error);
    return { error: "Failed to get wallet status", status: 500 };
  }
}

export async function activateWallet(
  walletAddress: string,
): Promise<ApiResponse<WalletStatus>> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("multi_sig_wallets")
      .update({
        status: "active",
        activated_at: now,
        updated_at: now,
      })
      .eq("address", walletAddress)
      .select()
      .single();

    if (error) throw error;

    const walletStatus: WalletStatus = {
      address: data.address,
      status: "active",
      activatedAt: now,
    };

    return { data: walletStatus, status: 200 };
  } catch (error) {
    console.error("Error activating wallet:", error);
    return { error: "Failed to activate wallet", status: 500 };
  }
}

export async function blockWallet(
  walletAddress: string,
  reason: string,
): Promise<ApiResponse<WalletStatus>> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("multi_sig_wallets")
      .update({
        status: "blocked",
        blocked_at: now,
        block_reason: reason,
        updated_at: now,
      })
      .eq("address", walletAddress)
      .select()
      .single();

    if (error) throw error;

    const walletStatus: WalletStatus = {
      address: data.address,
      status: "blocked",
      blockedAt: now,
      blockReason: reason,
    };

    return { data: walletStatus, status: 200 };
  } catch (error) {
    console.error("Error blocking wallet:", error);
    return { error: "Failed to block wallet", status: 500 };
  }
}

// Multi-signature wallet functions
export async function addSignatory(
  walletAddress: string,
  name: string,
  email: string,
  role: string,
): Promise<ApiResponse<SignatoryInfo>> {
  try {
    const { data, error } = await supabase
      .from("wallet_signatories")
      .insert({
        wallet_address: walletAddress,
        name,
        email,
        role,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const signatoryInfo: SignatoryInfo = {
      id: data.id,
      walletAddress: data.wallet_address,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    };

    return { data: signatoryInfo, status: 200 };
  } catch (error) {
    console.error("Error adding signatory:", error);
    return { error: "Failed to add signatory", status: 500 };
  }
}

export async function removeSignatory(
  signatoryId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const { error } = await supabase
      .from("wallet_signatories")
      .delete()
      .eq("id", signatoryId);

    if (error) throw error;

    return { data: { success: true }, status: 200 };
  } catch (error) {
    console.error("Error removing signatory:", error);
    return { error: "Failed to remove signatory", status: 500 };
  }
}

export async function getSignatories(
  walletAddress: string,
): Promise<ApiResponse<SignatoryInfo[]>> {
  try {
    const { data, error } = await supabase
      .from("wallet_signatories")
      .select("id, wallet_address, name, email, role, status")
      .eq("wallet_address", walletAddress);

    if (error) throw error;

    const signatories: SignatoryInfo[] = data.map((item) => ({
      id: item.id,
      walletAddress: item.wallet_address,
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
    }));

    return { data: signatories, status: 200 };
  } catch (error) {
    console.error("Error getting signatories:", error);
    return { error: "Failed to get signatories", status: 500 };
  }
}

// Whitelist management functions
export async function addToWhitelist(
  organizationId: string,
  address: string,
  label?: string,
  addedBy?: string,
): Promise<ApiResponse<WhitelistEntry>> {
  try {
    // First get the current whitelist
    const { data: currentData, error: fetchError } = await supabase
      .from("whitelist_settings")
      .select("addresses, address_labels")
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) throw fetchError;

    // Add the new address if it doesn't exist
    const currentAddresses = currentData.addresses || [];
    const currentLabels = currentData.address_labels || {};

    if (!currentAddresses.includes(address)) {
      const newAddresses = [...currentAddresses, address];
      const newLabels = { ...currentLabels };

      if (label) {
        newLabels[address] = label;
      }

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("whitelist_settings")
        .update({
          addresses: newAddresses,
          address_labels: newLabels,
          updated_at: now,
        })
        .eq("organization_id", organizationId);

      if (error) throw error;

      // Also add to whitelist_entries table for tracking
      const { data: entryData, error: entryError } = await supabase
        .from("whitelist_entries")
        .insert({
          organization_id: organizationId,
          address,
          label,
          added_by: addedBy,
          added_at: now,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      const whitelistEntry: WhitelistEntry = {
        address: entryData.address,
        label: entryData.label,
        addedAt: entryData.added_at,
        addedBy: entryData.added_by,
      };

      return { data: whitelistEntry, status: 200 };
    }

    // Address already exists
    return {
      data: {
        address,
        label: currentLabels[address],
        addedAt: new Date().toISOString(),
        addedBy,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error adding to whitelist:", error);
    return { error: "Failed to add address to whitelist", status: 500 };
  }
}

export async function removeFromWhitelist(
  organizationId: string,
  address: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    // First get the current whitelist
    const { data: currentData, error: fetchError } = await supabase
      .from("whitelist_settings")
      .select("addresses, address_labels")
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) throw fetchError;

    // Remove the address
    const currentAddresses = currentData.addresses || [];
    const currentLabels = currentData.address_labels || {};

    const newAddresses = currentAddresses.filter((addr) => addr !== address);
    const newLabels = { ...currentLabels };
    delete newLabels[address];

    const { error } = await supabase
      .from("whitelist_settings")
      .update({
        addresses: newAddresses,
        address_labels: newLabels,
        updated_at: new Date().toISOString(),
      })
      .eq("organization_id", organizationId);

    if (error) throw error;

    // Also remove from whitelist_entries table
    await supabase
      .from("whitelist_entries")
      .update({
        removed_at: new Date().toISOString(),
        active: false,
      })
      .eq("organization_id", organizationId)
      .eq("address", address);

    return { data: { success: true }, status: 200 };
  } catch (error) {
    console.error("Error removing from whitelist:", error);
    return { error: "Failed to remove address from whitelist", status: 500 };
  }
}

export async function getWhitelist(
  organizationId: string,
): Promise<ApiResponse<WhitelistEntry[]>> {
  try {
    const { data, error } = await supabase
      .from("whitelist_entries")
      .select("address, label, added_at, added_by")
      .eq("organization_id", organizationId)
      .eq("active", true);

    if (error) throw error;

    const whitelist: WhitelistEntry[] = data.map((item) => ({
      address: item.address,
      label: item.label,
      addedAt: item.added_at,
      addedBy: item.added_by,
    }));

    return { data: whitelist, status: 200 };
  } catch (error) {
    console.error("Error getting whitelist:", error);
    return { error: "Failed to get whitelist", status: 500 };
  }
}
