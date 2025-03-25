import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { multiSigWallet, MultiSigTransaction } from "@/lib/web3/MultiSigWallet";
import { walletManager, Wallet, WalletType } from "@/lib/web3/WalletManager";
import { tokenManager, TokenType, TokenBalance } from "@/lib/web3/TokenManager";
import * as ethers from "ethers";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Wallet as WalletIcon,
  Send,
  Plus,
  RefreshCw,
  FileText,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";

interface MultiSigWalletDashboardProps {
  walletId: string;
}

const MultiSigWalletDashboard: React.FC<MultiSigWalletDashboardProps> = ({
  walletId,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<{
    balance: string;
    formattedBalance: string;
  }>({ balance: "0", formattedBalance: "0" });
  const [pendingTransactions, setPendingTransactions] = useState<
    MultiSigTransaction[]
  >([]);
  const [executedTransactions, setExecutedTransactions] = useState<
    MultiSigTransaction[]
  >([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTransactionModal, setShowNewTransactionModal] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // New transaction form state
  const [newTxDestination, setNewTxDestination] = useState("");
  const [newTxValue, setNewTxValue] = useState("");
  const [newTxData, setNewTxData] = useState("0x");
  const [newTxDescription, setNewTxDescription] = useState("");
  const [newTxPassword, setNewTxPassword] = useState("");
  const [newTxBlockchain, setNewTxBlockchain] = useState(
    wallet?.blockchain || "ethereum",
  );

  // Initialize and load wallet data
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setLoading(true);
        setError(null);

        // For demo purposes, create a mock wallet if walletId is "demo-wallet"
        // This avoids the database lookup that's causing the error
        if (walletId === "demo-wallet") {
          // Create a mock wallet for demonstration
          const mockWallet: Wallet = {
            id: "demo-wallet",
            name: "Demo MultiSig Wallet",
            type: WalletType.MULTISIG,
            blockchain: "ethereum",
            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            signers: [
              "0x1234567890123456789012345678901234567890",
              "0x2345678901234567890123456789012345678901",
              "0x3456789012345678901234567890123456789012",
            ],
            requiredConfirmations: 2,
            userId: user?.id || "demo-user",
          };
          setWallet(mockWallet);

          // Set mock data for demonstration
          setBalance({ balance: "1.5", formattedBalance: "1.5" });

          // Mock pending transactions
          setPendingTransactions([
            {
              id: "tx1",
              walletId: "demo-wallet",
              to: "0x4567890123456789012345678901234567890123",
              value: "0.5",
              data: "0x",
              nonce: 0,
              description: "Send ETH to Team",
              confirmations: 1,
              required: 2,
              executed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "tx2",
              walletId: "demo-wallet",
              to: "0x5678901234567890123456789012345678901234",
              value: "0.25",
              data: "0x",
              nonce: 1,
              description: "Weekly Expenses",
              confirmations: 2,
              required: 2,
              executed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);

          // Mock executed transactions
          setExecutedTransactions([
            {
              id: "tx3",
              walletId: "demo-wallet",
              to: "0x6789012345678901234567890123456789012345",
              value: "0.75",
              data: "0x",
              nonce: 2,
              description: "Initial Funding",
              confirmations: 3,
              required: 2,
              executed: true,
              txHash:
                "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);

          // Mock token balances
          setTokenBalances([
            {
              tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              tokenType: TokenType.ERC20,
              name: "USD Coin",
              symbol: "USDC",
              balance: "1000",
              formattedBalance: "1,000",
              decimals: 6,
            },
            {
              tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              tokenType: TokenType.ERC20,
              name: "Tether USD",
              symbol: "USDT",
              balance: "500",
              formattedBalance: "500",
              decimals: 6,
            },
          ]);

          setLoading(false);
          return;
        }

        // Original code for real wallet lookup
        const walletDetails = await walletManager.getWalletById(walletId);
        if (!walletDetails) {
          throw new Error("Wallet not found");
        }

        if (walletDetails.type !== WalletType.MULTISIG) {
          throw new Error("Not a MultiSig wallet");
        }

        setWallet(walletDetails);

        // Initialize MultiSig wallet
        if (walletDetails.contractAddress) {
          // Use a default provider URL for demo purposes
          // In a real app, this would come from configuration
          const providerUrl = "https://mainnet.infura.io/v3/your-infura-key";

          await walletManager.initialize(providerUrl, user?.id, user?.email);
          await multiSigWallet.initialize(
            providerUrl,
            walletDetails.contractAddress,
            user?.id,
            user?.email,
          );

          // Get wallet balance
          const balanceInfo = await walletManager.getWalletBalance(
            walletDetails.address,
          );
          setBalance(balanceInfo);

          // Get pending transactions
          const pending = await multiSigWallet.getPendingTransactions();
          setPendingTransactions(pending);

          // Get executed transactions
          const executed = await multiSigWallet.getExecutedTransactions();
          setExecutedTransactions(executed);

          // Get token balances (example tokens)
          const tokens = [
            {
              address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              type: TokenType.ERC20,
            }, // USDC
            {
              address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              type: TokenType.ERC20,
            }, // USDT
            {
              address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              type: TokenType.ERC20,
            }, // WBTC
          ];

          const balances = await walletManager.getWalletTokenBalances(
            walletId,
            tokens,
          );
          setTokenBalances(balances);
        }
      } catch (err) {
        console.error("Failed to initialize wallet:", err);
        setError(err.message || "Failed to load wallet data");
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to load wallet data",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeWallet();
  }, [walletId, user, toast, refreshTrigger]);

  // Refresh data
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle transaction confirmation
  const handleConfirmTransaction = async (
    transactionId: string,
    password: string,
  ) => {
    try {
      // Get an EOA wallet to use as signer
      const userWallets = await walletManager.getUserWallets();
      const eoaWallet = userWallets.find((w) => w.type === WalletType.EOA);

      if (!eoaWallet || !eoaWallet.encryptedPrivateKey) {
        throw new Error("No EOA wallet found for signing");
      }

      // Decrypt private key
      const wallet = await ethers.Wallet.fromEncryptedJson(
        eoaWallet.encryptedPrivateKey,
        password,
      );

      // Confirm transaction
      const success = await multiSigWallet.confirmTransaction(
        transactionId,
        wallet,
      );

      if (success) {
        toast({
          title: "Transaction Confirmed",
          description: "Your confirmation has been recorded",
        });
        handleRefresh();
      } else {
        throw new Error("Failed to confirm transaction");
      }
    } catch (err) {
      console.error("Failed to confirm transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to confirm transaction",
      });
    }
  };

  // Handle transaction execution
  const handleExecuteTransaction = async (
    transactionId: string,
    password: string,
  ) => {
    try {
      // Get an EOA wallet to use as signer
      const userWallets = await walletManager.getUserWallets();
      const eoaWallet = userWallets.find((w) => w.type === WalletType.EOA);

      if (!eoaWallet || !eoaWallet.encryptedPrivateKey) {
        throw new Error("No EOA wallet found for signing");
      }

      // Decrypt private key
      const wallet = await ethers.Wallet.fromEncryptedJson(
        eoaWallet.encryptedPrivateKey,
        password,
      );

      // Execute transaction
      const success = await multiSigWallet.executeTransaction(
        transactionId,
        wallet,
      );

      if (success) {
        toast({
          title: "Transaction Executed",
          description: "The transaction has been executed successfully",
        });
        handleRefresh();
      } else {
        throw new Error("Failed to execute transaction");
      }
    } catch (err) {
      console.error("Failed to execute transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to execute transaction",
      });
    }
  };

  // Handle new transaction submission
  const handleSubmitTransaction = async () => {
    try {
      if (
        !newTxDestination ||
        !newTxValue ||
        !newTxDescription ||
        !newTxPassword
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      // Get an EOA wallet to use as signer
      const userWallets = await walletManager.getUserWallets();
      const eoaWallet = userWallets.find((w) => w.type === WalletType.EOA);

      if (!eoaWallet || !eoaWallet.encryptedPrivateKey) {
        throw new Error("No EOA wallet found for signing");
      }

      // Decrypt private key
      const signer = await ethers.Wallet.fromEncryptedJson(
        eoaWallet.encryptedPrivateKey,
        newTxPassword,
      );

      // Submit transaction
      const transactionId = await multiSigWallet.submitTransaction(
        newTxDestination,
        newTxValue,
        newTxData,
        newTxDescription,
        signer,
      );

      if (transactionId) {
        toast({
          title: "Transaction Submitted",
          description: "Your transaction has been submitted for approval",
        });
        setShowNewTransactionModal(false);
        handleRefresh();

        // Reset form
        setNewTxDestination("");
        setNewTxValue("");
        setNewTxData("0x");
        setNewTxDescription("");
        setNewTxPassword("");
      } else {
        throw new Error("Failed to submit transaction");
      }
    } catch (err) {
      console.error("Failed to submit transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to submit transaction",
      });
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingState message="Loading wallet data..." />;
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Render empty state if no wallet found
  if (!wallet) {
    return (
      <EmptyState
        title="Wallet Not Found"
        description="The requested MultiSig wallet could not be found."
        action={
          <Button onClick={() => navigate("/wallet/dashboard")}>
            Back to Dashboard
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{wallet.name}</h1>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <WalletIcon className="mr-1 h-4 w-4" />
              <span className="font-mono">{wallet.address}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Shield className="mr-1 h-3 w-3" />
              <span className="capitalize">
                {wallet.blockchain || "ethereum"} Blockchain
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowNewTransactionModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.formattedBalance} ETH
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ ${parseFloat(balance.formattedBalance) * 3000}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Signers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallet.signers?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {wallet.requiredConfirmations || 0} required for execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting signatures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="signers">Signers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Overview</CardTitle>
              <CardDescription>Summary of your MultiSig wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Wallet Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{wallet.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p>MultiSig Wallet</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-mono text-sm">{wallet.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contract Address
                      </p>
                      <p className="font-mono text-sm">
                        {wallet.contractAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Signature Requirements
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Required Confirmations</span>
                      <Badge variant="outline">
                        {wallet.requiredConfirmations} of{" "}
                        {wallet.signers?.length}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        ((wallet.requiredConfirmations || 0) /
                          (wallet.signers?.length || 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                  {pendingTransactions.length > 0 ? (
                    <div className="space-y-2">
                      {pendingTransactions.slice(0, 3).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex justify-between items-center p-2 border rounded-md"
                        >
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-amber-500" />
                            <div>
                              <p className="text-sm font-medium">
                                {tx.description || "Transaction"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.confirmations} of {tx.required}{" "}
                                confirmations
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            Pending
                          </Badge>
                        </div>
                      ))}
                      {pendingTransactions.length > 3 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-2"
                          onClick={() => setActiveTab("transactions")}
                        >
                          View all transactions
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent transactions
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Manage and view transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">
                    Pending ({pendingTransactions.length})
                  </TabsTrigger>
                  <TabsTrigger value="executed">
                    Executed ({executedTransactions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  {pendingTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {pendingTransactions.map((tx) => (
                        <div key={tx.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">
                                {tx.description || "Transaction"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ID: {tx.id}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              Pending
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                To
                              </p>
                              <p className="text-sm font-mono">{tx.to}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Value
                              </p>
                              <p className="text-sm">{tx.value} ETH</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-1">
                              Confirmations
                            </p>
                            <Progress
                              value={(tx.confirmations / tx.required) * 100}
                              className="h-2 mb-1"
                            />
                            <p className="text-xs">
                              {tx.confirmations} of {tx.required} required
                            </p>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleConfirmTransaction(
                                  tx.id || "",
                                  "password",
                                )
                              }
                            >
                              Confirm
                            </Button>
                            {tx.confirmations >= tx.required && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleExecuteTransaction(
                                    tx.id || "",
                                    "password",
                                  )
                                }
                              >
                                Execute
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No Pending Transactions"
                      description="There are no transactions waiting for confirmation."
                      action={
                        <Button
                          onClick={() => setShowNewTransactionModal(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          New Transaction
                        </Button>
                      }
                    />
                  )}
                </TabsContent>

                <TabsContent value="executed">
                  {executedTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {executedTransactions.map((tx) => (
                        <div key={tx.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">
                                {tx.description || "Transaction"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ID: {tx.id}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Executed
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                To
                              </p>
                              <p className="text-sm font-mono">{tx.to}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Value
                              </p>
                              <p className="text-sm">{tx.value} ETH</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Transaction Hash
                              </p>
                              <p className="text-sm font-mono">
                                {tx.txHash || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Created At
                              </p>
                              <p className="text-sm">
                                {tx.createdAt
                                  ? new Date(tx.createdAt).toLocaleString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No Executed Transactions"
                      description="There are no executed transactions in the history."
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>
                View and manage your token assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tokenBalances.length > 0 ? (
                <div className="space-y-4">
                  {tokenBalances.map((token, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-medium text-xs">
                            {token.symbol?.substring(0, 3) || "TOK"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {token.name || token.tokenAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {token.symbol} • {token.tokenType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {token.formattedBalance || token.balance}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {token.tokenType === TokenType.ERC20 &&
                            `${parseFloat(token.formattedBalance || "0") * 1.2} USD`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Tokens Found"
                  description="This wallet doesn't have any token holdings yet."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Signers</CardTitle>
              <CardDescription>
                Manage authorized signers for this wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      Required Confirmations
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {wallet.requiredConfirmations} out of{" "}
                      {wallet.signers?.length} signers must confirm transactions
                    </p>
                  </div>
                  <Badge variant="outline">
                    {wallet.requiredConfirmations} / {wallet.signers?.length}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Authorized Signers
                  </h3>
                  {wallet.signers && wallet.signers.length > 0 ? (
                    <div className="space-y-2">
                      {wallet.signers.map((signer, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="font-medium text-xs">
                                {index + 1}
                              </span>
                            </div>
                            <p className="font-mono text-sm">{signer}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Signer
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No signers found for this wallet.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <Dialog
          open={showNewTransactionModal}
          onOpenChange={setShowNewTransactionModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
              <DialogDescription>
                Create a new transaction that requires{" "}
                {wallet.requiredConfirmations} of {wallet.signers?.length}{" "}
                signatures.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain</Label>
                <select
                  id="blockchain"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTxBlockchain}
                  onChange={(e) => setNewTxBlockchain(e.target.value)}
                  disabled={wallet?.blockchain !== undefined}
                >
                  <optgroup label="EVM Chains">
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="avalanche">Avalanche</option>
                    <option value="optimism">Optimism</option>
                    <option value="base">Base</option>
                    <option value="zksync">ZK Sync Era</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="mantle">Mantle</option>
                    <option value="hedera">Hedera</option>
                  </optgroup>
                  <optgroup label="Non-EVM Chains">
                    <option value="solana">Solana</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ripple">Ripple/XRP</option>
                    <option value="aptos">Aptos</option>
                    <option value="sui">Sui</option>
                    <option value="stellar">Stellar</option>
                    <option value="near">NEAR</option>
                  </optgroup>
                </select>
                <p className="text-xs text-muted-foreground">
                  {wallet?.blockchain
                    ? "This wallet is on the " +
                      wallet.blockchain +
                      " blockchain"
                    : "Select the blockchain for this transaction"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Recipient Address</Label>
                <Input
                  id="destination"
                  placeholder={
                    newTxBlockchain === "bitcoin"
                      ? "bc1..."
                      : newTxBlockchain === "solana"
                        ? "Solana address..."
                        : "0x..."
                  }
                  value={newTxDestination}
                  onChange={(e) => setNewTxDestination(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Amount</Label>
                <div className="flex">
                  <Input
                    id="value"
                    type="number"
                    placeholder="0.0"
                    step="0.001"
                    value={newTxValue}
                    onChange={(e) => setNewTxValue(e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md border border-l-0 border-input bg-background px-3 text-sm font-medium h-10">
                    {newTxBlockchain === "ethereum"
                      ? "ETH"
                      : newTxBlockchain === "polygon"
                        ? "MATIC"
                        : newTxBlockchain === "avalanche"
                          ? "AVAX"
                          : newTxBlockchain === "optimism"
                            ? "ETH"
                            : newTxBlockchain === "base"
                              ? "ETH"
                              : newTxBlockchain === "zksync"
                                ? "ETH"
                                : newTxBlockchain === "arbitrum"
                                  ? "ETH"
                                  : newTxBlockchain === "mantle"
                                    ? "MNT"
                                    : newTxBlockchain === "hedera"
                                      ? "HBAR"
                                      : newTxBlockchain === "solana"
                                        ? "SOL"
                                        : newTxBlockchain === "bitcoin"
                                          ? "BTC"
                                          : newTxBlockchain === "ripple"
                                            ? "XRP"
                                            : newTxBlockchain === "aptos"
                                              ? "APT"
                                              : newTxBlockchain === "sui"
                                                ? "SUI"
                                                : newTxBlockchain === "stellar"
                                                  ? "XLM"
                                                  : newTxBlockchain === "near"
                                                    ? "NEAR"
                                                    : "TOKENS"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data (Optional)</Label>
                <Input
                  id="data"
                  placeholder="0x..."
                  value={newTxData}
                  onChange={(e) => setNewTxData(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Transaction description"
                  value={newTxDescription}
                  onChange={(e) => setNewTxDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Wallet Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your wallet password"
                  value={newTxPassword}
                  onChange={(e) => setNewTxPassword(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTransactionModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitTransaction}>
                Submit Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MultiSigWalletDashboard;
