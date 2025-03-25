import { useState, useEffect } from "react";
import {
  WalletAddress,
  WhitelistSettings,
  getWalletData,
} from "../dashboardData";
import {
  getWalletStatus,
  activateWallet,
  blockWallet,
  addSignatory,
  removeSignatory,
  getSignatories,
  addToWhitelist,
  removeFromWhitelist,
  getWhitelist,
} from "../walletService";

export function useWallet(organizationId: string = "default-org") {
  const [sourceWallets, setSourceWallets] = useState<WalletAddress[]>([]);
  const [issuanceWallets, setIssuanceWallets] = useState<WalletAddress[]>([]);
  const [whitelistSettings, setWhitelistSettings] = useState<WhitelistSettings>(
    { enabled: false, addresses: [] },
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load wallet data on component mount
  useEffect(() => {
    loadWalletData();
  }, [organizationId]);

  // Load wallet data from the API
  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await getWalletData(organizationId);
      setSourceWallets(data.sourceWallets);
      setIssuanceWallets(data.issuanceWallets);
      setWhitelistSettings(data.whitelistSettings);
      setError(null);
    } catch (err) {
      console.error("Error loading wallet data:", err);
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  // Activate a wallet
  const activateWalletAddress = async (walletAddress: string) => {
    setLoading(true);
    try {
      const response = await activateWallet(walletAddress);
      if (response.error) {
        throw new Error(response.error);
      }

      // Update the wallet status in the local state
      updateWalletStatus(walletAddress, "active");

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error activating wallet:", err);
      setError("Failed to activate wallet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Block a wallet
  const blockWalletAddress = async (walletAddress: string, reason: string) => {
    setLoading(true);
    try {
      const response = await blockWallet(walletAddress, reason);
      if (response.error) {
        throw new Error(response.error);
      }

      // Update the wallet status in the local state
      updateWalletStatus(walletAddress, "blocked");

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error blocking wallet:", err);
      setError("Failed to block wallet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a signatory to a multi-sig wallet
  const addWalletSignatory = async (
    walletAddress: string,
    name: string,
    email: string,
    role: string,
  ) => {
    setLoading(true);
    try {
      const response = await addSignatory(walletAddress, name, email, role);
      if (response.error) {
        throw new Error(response.error);
      }

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error adding signatory:", err);
      setError("Failed to add signatory");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove a signatory from a multi-sig wallet
  const removeWalletSignatory = async (signatoryId: string) => {
    setLoading(true);
    try {
      const response = await removeSignatory(signatoryId);
      if (response.error) {
        throw new Error(response.error);
      }

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error removing signatory:", err);
      setError("Failed to remove signatory");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add an address to the whitelist
  const addAddressToWhitelist = async (address: string, label?: string) => {
    setLoading(true);
    try {
      const response = await addToWhitelist(organizationId, address, label);
      if (response.error) {
        throw new Error(response.error);
      }

      // Update the whitelist in the local state
      setWhitelistSettings((prev) => ({
        ...prev,
        addresses: [...prev.addresses, address],
      }));

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error adding to whitelist:", err);
      setError("Failed to add address to whitelist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove an address from the whitelist
  const removeAddressFromWhitelist = async (address: string) => {
    setLoading(true);
    try {
      const response = await removeFromWhitelist(organizationId, address);
      if (response.error) {
        throw new Error(response.error);
      }

      // Update the whitelist in the local state
      setWhitelistSettings((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((addr) => addr !== address),
      }));

      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error removing from whitelist:", err);
      setError("Failed to remove address from whitelist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle whitelist enabled/disabled
  const toggleWhitelist = async (enabled: boolean) => {
    setLoading(true);
    try {
      // Update the whitelist settings in the database
      const { error } = await supabase
        .from("whitelist_settings")
        .update({ enabled })
        .eq("organization_id", organizationId);

      if (error) throw error;

      // Update the local state
      setWhitelistSettings((prev) => ({
        ...prev,
        enabled,
      }));

      setError(null);
    } catch (err) {
      console.error("Error toggling whitelist:", err);
      setError("Failed to toggle whitelist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update wallet status in the local state
  const updateWalletStatus = (
    walletAddress: string,
    status: "active" | "pending" | "blocked",
  ) => {
    // Check source wallets
    setSourceWallets((prev) => {
      const index = prev.findIndex(
        (wallet) => wallet.address === walletAddress,
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], status };
        return updated;
      }
      return prev;
    });

    // Check issuance wallets
    setIssuanceWallets((prev) => {
      const index = prev.findIndex(
        (wallet) => wallet.address === walletAddress,
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], status };
        return updated;
      }
      return prev;
    });
  };

  return {
    sourceWallets,
    issuanceWallets,
    whitelistSettings,
    loading,
    error,
    loadWalletData,
    activateWallet: activateWalletAddress,
    blockWallet: blockWalletAddress,
    addSignatory: addWalletSignatory,
    removeSignatory: removeWalletSignatory,
    addToWhitelist: addAddressToWhitelist,
    removeFromWhitelist: removeAddressFromWhitelist,
    toggleWhitelist,
  };
}
