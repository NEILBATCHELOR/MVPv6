import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Shield, Users, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NewWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletName, setWalletName] = useState("");
  const [walletType, setWalletType] = useState("multisig");
  const [blockchain, setBlockchain] = useState("ethereum");
  const [threshold, setThreshold] = useState(2);
  const [signers, setSigners] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = () => {
    setLoading(true);
    // Simulate wallet creation
    setTimeout(() => {
      toast({
        title: "Wallet Created",
        description: `Your ${walletType} wallet on ${blockchain} has been created successfully.`,
      });
      setLoading(false);
      navigate("/wallet/multisig?id=demo-wallet");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Wallet</h1>
        <Button variant="outline" onClick={() => navigate("/wallet/dashboard")}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Configuration</CardTitle>
              <CardDescription>
                Configure your new blockchain wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Wallet Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Treasury MultiSig"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Wallet Type</Label>
                <Tabs
                  defaultValue="multisig"
                  value={walletType}
                  onValueChange={setWalletType}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="multisig">
                      <Users className="h-4 w-4 mr-2" />
                      MultiSig Wallet
                    </TabsTrigger>
                    <TabsTrigger value="eoa">
                      <Key className="h-4 w-4 mr-2" />
                      EOA Wallet
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain</Label>
                <select
                  id="blockchain"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
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
              </div>

              {walletType === "multisig" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signers">Number of Signers</Label>
                    <Input
                      id="signers"
                      type="number"
                      min="2"
                      max="10"
                      value={signers}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setSigners(value);
                        if (threshold > value) setThreshold(value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Required Signatures</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      max={signers}
                      value={threshold}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setThreshold(Math.min(value, signers));
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCreateWallet}
                disabled={!walletName || loading}
              >
                {loading ? "Creating..." : "Create Wallet"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Wallet Preview</CardTitle>
              <CardDescription>
                Preview of your new wallet configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {walletType === "multisig" ? (
                      <Users className="h-6 w-6 text-primary" />
                    ) : (
                      <Key className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {walletName || "[Unnamed Wallet]"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {walletType === "multisig"
                        ? `MultiSig (${threshold}/${signers})`
                        : "EOA Wallet"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">
                        {walletType === "multisig" ? "MultiSig" : "EOA"}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-muted-foreground">Blockchain:</span>
                      <span className="font-medium flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="capitalize">{blockchain}</span>
                      </span>
                    </li>
                    {walletType === "multisig" && (
                      <>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Signers:
                          </span>
                          <span className="font-medium">{signers}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">
                            Threshold:
                          </span>
                          <span className="font-medium">{threshold}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewWalletPage;
