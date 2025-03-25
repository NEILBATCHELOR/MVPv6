import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Wallet,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const InvestorWalletSetup = () => {
  const navigate = useNavigate();
  const [walletType, setWalletType] = useState<"create" | "connect">("create");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletStatus, setWalletStatus] = useState<
    "pending" | "active" | "blocked"
  >("pending");
  const [error, setError] = useState<string | null>(null);

  // For multi-signature wallet setup (institutional investors)
  const [isMultiSig, setIsMultiSig] = useState(false);
  const [signatories, setSignatories] = useState<
    { name: string; email: string; role: string }[]
  >([]);
  const [newSignatory, setNewSignatory] = useState({
    name: "",
    email: "",
    role: "approver",
  });

  const handleWalletTypeChange = (type: "create" | "connect") => {
    setWalletType(type);
    // Reset wallet address when changing type
    setWalletAddress("");
  };

  const handleConnectWallet = () => {
    // Mock wallet connection
    // In a real app, this would connect to MetaMask or other wallet providers
    setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    setWalletStatus("pending");
  };

  const handleCreateWallet = () => {
    // Mock wallet creation
    setWalletAddress("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    setWalletStatus("pending");
  };

  const handleAddSignatory = () => {
    if (newSignatory.name && newSignatory.email) {
      setSignatories([...signatories, newSignatory]);
      setNewSignatory({ name: "", email: "", role: "approver" });
    }
  };

  const validateForm = () => {
    if (!walletAddress) {
      setError("Please create or connect a wallet to continue");
      return false;
    }

    if (isMultiSig && signatories.length < 1) {
      setError(
        "Please add at least one additional signatory for multi-signature setup",
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, this would submit the wallet setup to the backend
      navigate("/investor/dashboard");
    }
  };

  const getWalletStatusBadge = () => {
    switch (walletStatus) {
      case "active":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Active - Ready for Investment</span>
          </div>
        );
      case "blocked":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Blocked - Requires Review</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <AlertCircle className="h-5 w-5" />
            <span>Pending Activation</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Guardian SPV</h1>
          </div>
          <div className="text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-primary">
              Contact support
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">
              Wallet Setup & Compliance Approval
            </h1>
            <span className="text-sm font-medium text-gray-500">
              Step 5 of 6
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Set up your investment wallet and complete the compliance approval
            process
          </p>
          <Progress value={83} className="h-2" />
        </div>

        <Card className="bg-white rounded-lg shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Investment Wallet Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Wallet Options</h3>
                  <RadioGroup
                    value={walletType}
                    onValueChange={(value) =>
                      handleWalletTypeChange(value as "create" | "connect")
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="create"
                          id="create"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="create"
                            className="font-medium cursor-pointer"
                          >
                            Create a Guardian Wallet
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            We'll create a secure wallet for you that's fully
                            compliant with all regulations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="connect"
                          id="connect"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="connect"
                            className="font-medium cursor-pointer"
                          >
                            Connect Existing Wallet
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Connect your MetaMask, Ledger, or other compatible
                            wallet
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {walletType === "connect" ? (
                  <div className="p-6 border rounded-lg bg-gray-50">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Wallet className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Connect Your Wallet
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 max-w-md">
                        Connect your existing wallet to participate in
                        investments. You'll need to sign a message to verify
                        ownership.
                      </p>
                      <Button
                        type="button"
                        onClick={handleConnectWallet}
                        disabled={!!walletAddress}
                      >
                        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border rounded-lg bg-gray-50">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Shield className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Create Guardian Wallet
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 max-w-md">
                        We'll create a secure, compliant wallet for you. This
                        wallet will be used for all your investments on the
                        platform.
                      </p>
                      <Button
                        type="button"
                        onClick={handleCreateWallet}
                        disabled={!!walletAddress}
                      >
                        {walletAddress ? "Wallet Created" : "Create Wallet"}
                      </Button>
                    </div>
                  </div>
                )}

                {walletAddress && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Wallet Address</p>
                        <p className="font-mono text-sm truncate max-w-xs md:max-w-md">
                          {walletAddress}
                        </p>
                      </div>
                      <div>{getWalletStatusBadge()}</div>
                    </div>
                  </div>
                )}

                {walletStatus === "pending" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your wallet will be activated once your KYC/AML
                      verification is complete. This typically takes 1-2
                      business days.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Multi-signature wallet setup for institutional investors */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      Multi-Signature Setup
                    </h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="multi-sig"
                        checked={isMultiSig}
                        onChange={(e) => setIsMultiSig(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="multi-sig">Enable Multi-Signature</Label>
                    </div>
                  </div>

                  {isMultiSig && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Multi-signature wallets require approval from multiple
                        parties for transactions, providing enhanced security
                        for institutional investors.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="signatoryName">Name</Label>
                          <Input
                            id="signatoryName"
                            value={newSignatory.name}
                            onChange={(e) =>
                              setNewSignatory({
                                ...newSignatory,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signatoryEmail">Email</Label>
                          <Input
                            id="signatoryEmail"
                            type="email"
                            value={newSignatory.email}
                            onChange={(e) =>
                              setNewSignatory({
                                ...newSignatory,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signatoryRole">Role</Label>
                          <select
                            id="signatoryRole"
                            value={newSignatory.role}
                            onChange={(e) =>
                              setNewSignatory({
                                ...newSignatory,
                                role: e.target.value,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="approver">Approver</option>
                            <option value="trustee">Trustee</option>
                            <option value="admin">Fund Administrator</option>
                            <option value="legal">Legal Representative</option>
                          </select>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddSignatory}
                        className="w-full"
                      >
                        Add Signatory
                      </Button>

                      {signatories.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            Added Signatories
                          </h4>
                          <div className="space-y-2">
                            {signatories.map((sig, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 border rounded-md"
                              >
                                <div>
                                  <p className="font-medium">{sig.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {sig.email}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {sig.role.charAt(0).toUpperCase() +
                                      sig.role.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/investor/kyc")}
                >
                  Back
                </Button>
                <Button type="submit" size="lg">
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Wallet Activation Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium">KYC/AML Status</h3>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">In Progress</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium">Accreditation</h3>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Wallet className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="font-medium">Wallet Status</h3>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Pending Activation</span>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Your wallet will be automatically activated once all
                  compliance checks are complete. You'll receive an email
                  notification when your wallet is ready for investment.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Guardian SPV. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default InvestorWalletSetup;
