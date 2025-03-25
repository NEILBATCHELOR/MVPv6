import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Plus,
  RefreshCw,
  ArrowUpDown,
  History,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WalletDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => navigate("/wallet/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Wallet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128,420.50</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 MultiSig, 1 EOA
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 require your signature
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="wallets">My Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Wallets</CardTitle>
              <CardDescription>
                Manage your crypto wallets and keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* MultiSig Wallet */}
                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/wallet/multisig?id=demo-wallet")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Main MultiSig Wallet</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          0x7Fc9...8F3e
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Shield className="mr-1 h-3 w-3" />
                          <span>Ethereum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$98,245.32</p>
                    <p className="text-xs text-muted-foreground">3/5 signers</p>
                  </div>
                </div>

                {/* Secondary MultiSig Wallet */}
                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/wallet/multisig?id=demo-wallet")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Treasury MultiSig</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          0x3Ab2...9D1c
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Shield className="mr-1 h-3 w-3" />
                          <span>Polygon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$28,750.18</p>
                    <p className="text-xs text-muted-foreground">2/3 signers</p>
                  </div>
                </div>

                {/* EOA Wallet */}
                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/wallet/keys")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Personal Wallet</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          0x9Ff4...2A7b
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Shield className="mr-1 h-3 w-3" />
                          <span>Avalanche</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,425.00</p>
                    <p className="text-xs text-muted-foreground">EOA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Transaction 1 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ArrowUpDown className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Token Transfer</h3>
                      <p className="text-sm text-muted-foreground">
                        To: 0x8Dd3...4F2a
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1,000 USDC</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>

                {/* Transaction 2 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <History className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Pending Approval</h3>
                      <p className="text-sm text-muted-foreground">
                        MultiSig: 2/3 signatures
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">5,000 USDC</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>

                {/* Transaction 3 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ArrowUpDown className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">ETH Transfer</h3>
                      <p className="text-sm text-muted-foreground">
                        From: 0x3Ab2...9D1c
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">0.5 ETH</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>
                Your crypto assets across all wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Token 1 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center w-10 h-10">
                      <span className="font-bold text-blue-600">ETH</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Ethereum</h3>
                      <p className="text-sm text-muted-foreground">ERC20</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">12.5 ETH</p>
                    <p className="text-xs text-muted-foreground">$23,456.78</p>
                  </div>
                </div>

                {/* Token 2 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full flex items-center justify-center w-10 h-10">
                      <span className="font-bold text-green-600">USDC</span>
                    </div>
                    <div>
                      <h3 className="font-medium">USD Coin</h3>
                      <p className="text-sm text-muted-foreground">ERC20</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">50,000 USDC</p>
                    <p className="text-xs text-muted-foreground">$50,000.00</p>
                  </div>
                </div>

                {/* Token 3 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full flex items-center justify-center w-10 h-10">
                      <span className="font-bold text-purple-600">NFT</span>
                    </div>
                    <div>
                      <h3 className="font-medium">CryptoKitties #1234</h3>
                      <p className="text-sm text-muted-foreground">ERC721</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1 NFT</p>
                    <p className="text-xs text-muted-foreground">~$1,200.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletDashboardPage;
