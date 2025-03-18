import React from "react";
import MultiSigWalletDashboard from "@/components/wallet/MultiSigWalletDashboard";

const MultiSigWalletPage: React.FC = () => {
  // This is a simple wrapper component that renders the MultiSigWalletDashboard
  // For demo purposes, we'll use a mock wallet ID that doesn't require DB lookup
  return (
    <div className="container mx-auto py-6">
      <MultiSigWalletDashboard walletId="demo-wallet" />
    </div>
  );
};

export default MultiSigWalletPage;
