import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Coins, Plus, ArrowUpDown, RefreshCw, Search } from "lucide-react";

const TokenManagementPage: React.FC = () => {
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [tokenType, setTokenType] = useState("ERC20");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const handleAddToken = () => {
    // In a real app, this would add the token to the wallet
    console.log("Adding token of type:", tokenType);
    setShowAddTokenDialog(false);
  };

  const handleTransfer = () => {
    // In a real app, this would transfer the token
    console.log("Transferring token:", selectedToken);
    setShowTransferDialog(false);
  };

  const openTransferDialog = (token: any) => {
    setSelectedToken(token);
    setShowTransferDialog(true);
  };

  // Sample token data
  const tokens = [
    {
      id: 1,
      name: "Ethereum",
      symbol: "ETH",
      type: "Native",
      balance: "12.5",
      value: "$23,456.78",
    },
    {
      id: 2,
      name: "USD Coin",
      symbol: "USDC",
      type: "ERC20",
      balance: "50,000",
      value: "$50,000.00",
    },
    {
      id: 3,
      name: "CryptoKitties #1234",
      symbol: "KITTY",
      type: "ERC721",
      balance: "1",
      value: "~$1,200.00",
    },
    {
      id: 4,
      name: "Chain Capital Token",
      symbol: "CCT",
      type: "ERC20",
      balance: "100,000",
      value: "$25,000.00",
    },
    {
      id: 5,
      name: "Game Items",
      symbol: "ITEMS",
      type: "ERC1155",
      balance: "Various",
      value: "$3,500.00",
    },
    {
      id: 6,
      name: "Security Token",
      symbol: "SCRT",
      type: "ERC1400",
      balance: "5,000",
      value: "$15,000.00",
    },
    {
      id: 7,
      name: "Vault Shares",
      symbol: "vUSDC",
      type: "ERC4626",
      balance: "10,000",
      value: "$10,200.00",
    },
  ];

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddTokenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Token
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-5 mb-4">
          <TabsTrigger value="all">All Tokens</TabsTrigger>
          <TabsTrigger value="erc20">ERC20</TabsTrigger>
          <TabsTrigger value="erc721">NFTs</TabsTrigger>
          <TabsTrigger value="erc1155">Multi-Token</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tokens</CardTitle>
              <CardDescription>Manage all your token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-8 h-8">
                            <span className="font-bold text-primary text-xs">
                              {token.symbol.substring(0, 3)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{token.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {token.symbol}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {token.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{token.balance}</TableCell>
                      <TableCell>{token.value}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTransferDialog(token)}
                        >
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Transfer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erc20" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ERC20 Tokens</CardTitle>
              <CardDescription>Fungible token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens
                    .filter((token) => token.type === "ERC20")
                    .map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-8 h-8">
                              <span className="font-bold text-primary text-xs">
                                {token.symbol.substring(0, 3)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{token.balance}</TableCell>
                        <TableCell>{token.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTransferDialog(token)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Transfer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erc721" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NFTs (ERC721)</CardTitle>
              <CardDescription>Non-fungible token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token ID</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens
                    .filter((token) => token.type === "ERC721")
                    .map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-full flex items-center justify-center w-8 h-8">
                              <span className="font-bold text-purple-600 text-xs">
                                {token.symbol.substring(0, 3)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>#1234</TableCell>
                        <TableCell>{token.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTransferDialog(token)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Transfer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erc1155" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Tokens (ERC1155)</CardTitle>
              <CardDescription>Multi-token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token IDs</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens
                    .filter((token) => token.type === "ERC1155")
                    .map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="bg-amber-100 p-2 rounded-full flex items-center justify-center w-8 h-8">
                              <span className="font-bold text-amber-600 text-xs">
                                {token.symbol.substring(0, 3)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Multiple IDs</TableCell>
                        <TableCell>{token.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTransferDialog(token)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Transfer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Token Standards</CardTitle>
              <CardDescription>
                ERC1400, ERC3525, ERC4626 and other token standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens
                    .filter(
                      (token) =>
                        !["ERC20", "ERC721", "ERC1155", "Native"].includes(
                          token.type,
                        ),
                    )
                    .map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-full flex items-center justify-center w-8 h-8">
                              <span className="font-bold text-green-600 text-xs">
                                {token.symbol.substring(0, 3)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {token.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{token.balance}</TableCell>
                        <TableCell>{token.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTransferDialog(token)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Transfer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Token Dialog */}
      <Dialog open={showAddTokenDialog} onOpenChange={setShowAddTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Token</DialogTitle>
            <DialogDescription>
              Add a new token to your wallet by entering its details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tokenType">Token Standard</Label>
              <Select value={tokenType} onValueChange={setTokenType}>
                <SelectTrigger id="tokenType">
                  <SelectValue placeholder="Select token type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERC20">ERC20 - Fungible Token</SelectItem>
                  <SelectItem value="ERC721">
                    ERC721 - Non-Fungible Token (NFT)
                  </SelectItem>
                  <SelectItem value="ERC1155">ERC1155 - Multi Token</SelectItem>
                  <SelectItem value="ERC1400">
                    ERC1400 - Security Token
                  </SelectItem>
                  <SelectItem value="ERC3525">
                    ERC3525 - Semi-Fungible Token
                  </SelectItem>
                  <SelectItem value="ERC4626">
                    ERC4626 - Tokenized Vault
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractAddress">Contract Address</Label>
              <Input id="contractAddress" placeholder="0x..." />
            </div>
            {tokenType === "ERC721" || tokenType === "ERC1155" ? (
              <div className="space-y-2">
                <Label htmlFor="tokenId">Token ID (for NFTs)</Label>
                <Input id="tokenId" placeholder="Token ID" />
              </div>
            ) : null}
            {tokenType === "ERC1400" && (
              <div className="space-y-2">
                <Label htmlFor="partition">Partition (for ERC1400)</Label>
                <Input id="partition" placeholder="Partition name" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTokenDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddToken}>Add Token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Token Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Token</DialogTitle>
            <DialogDescription>
              {selectedToken &&
                `Transfer ${selectedToken.name} (${selectedToken.symbol}) to another address.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Input id="recipientAddress" placeholder="0x..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Amount to transfer" />
            </div>
            {selectedToken && selectedToken.type === "ERC721" && (
              <div className="space-y-2">
                <Label htmlFor="tokenId">Token ID</Label>
                <Input id="tokenId" value="#1234" disabled />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="gasPrice">Gas Price (Gwei)</Label>
              <Input id="gasPrice" placeholder="Gas price" defaultValue="5" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTransferDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleTransfer}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenManagementPage;
