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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";

const KeyManagementPage: React.FC = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [password, setPassword] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importKey, setImportKey] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletPassword, setNewWalletPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const handleShowPrivateKey = () => {
    // In a real app, this would decrypt and show the private key
    setShowPrivateKey(!showPrivateKey);
  };

  const handleCreateWallet = () => {
    // Validate passwords match
    if (newWalletPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // In a real app, this would create a new wallet
    console.log("Creating new wallet with name:", newWalletName);
    setShowCreateDialog(false);

    // Reset form
    setNewWalletName("");
    setNewWalletPassword("");
    setConfirmPassword("");
  };

  const handleImportWallet = () => {
    // In a real app, this would import the wallet
    console.log(
      "Importing wallet with key",
      importKey.substring(0, 10) + "...",
    );
    setShowImportDialog(false);

    // Reset form
    setImportKey("");
    setImportPassword("");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Key Management</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      <Tabs defaultValue="eoa" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
          <TabsTrigger value="eoa">EOA Wallets</TabsTrigger>
          <TabsTrigger value="signers">MultiSig Signers</TabsTrigger>
        </TabsList>

        <TabsContent value="eoa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your EOA Wallets</CardTitle>
              <CardDescription>
                Manage your externally owned accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Wallet 1 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">Main Wallet</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-mono text-muted-foreground">
                          0x9Ff4...2A7b
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => handleCopyAddress("0x9Ff4...2A7b")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Backup
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShowPrivateKey}
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4 mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        {showPrivateKey ? "Hide Key" : "Show Key"}
                      </Button>
                    </div>
                  </div>

                  {showPrivateKey && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="password">
                          Enter Password to View Private Key
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your wallet password"
                        />
                      </div>
                      {password === "password" && (
                        <Alert>
                          <AlertDescription className="font-mono text-sm break-all">
                            0x8a85e5937ce8a75c1f2eb3c7803c46dbd1a0cbccb8a85e5937ce8a75c1f2eb3c
                          </AlertDescription>
                        </Alert>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Warning: Never share your private key with anyone.
                        Anyone with your private key has full control of your
                        wallet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Wallet 2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Development Wallet</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-mono text-muted-foreground">
                          0x3Ab2...9D1c
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => handleCopyAddress("0x3Ab2...9D1c")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Backup
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Show Key
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MultiSig Signers</CardTitle>
              <CardDescription>
                Manage your signing keys for MultiSig wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Signer 1 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Main Treasury Signer</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-mono text-muted-foreground">
                          0x7Fc9...8F3e
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => handleCopyAddress("0x7Fc9...8F3e")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Used in 2 MultiSig wallets
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signer 2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Operations Signer</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-mono text-muted-foreground">
                          0x8Dd3...4F2a
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => handleCopyAddress("0x8Dd3...4F2a")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Used in 1 MultiSig wallet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Wallet Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Wallet</DialogTitle>
            <DialogDescription>
              Generate a new EOA wallet with a secure private key.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input
                id="walletName"
                placeholder="My Wallet"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletPassword">Password</Label>
              <Input
                id="walletPassword"
                type="password"
                placeholder="Create a strong password"
                value={newWalletPassword}
                onChange={(e) => setNewWalletPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateWallet}>Create Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Wallet Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Wallet</DialogTitle>
            <DialogDescription>
              Import an existing wallet using a private key.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <Input
                id="privateKey"
                placeholder="Enter your private key"
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="importPassword">New Password</Label>
              <Input
                id="importPassword"
                type="password"
                placeholder="Create a password to encrypt this key"
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
              />
            </div>
            <Alert>
              <AlertDescription>
                Warning: Make sure you're on a secure connection. Never share
                your private key with anyone.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleImportWallet}>Import Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KeyManagementPage;
