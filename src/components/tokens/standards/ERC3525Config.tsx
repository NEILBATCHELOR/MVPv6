import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface ERC3525ConfigProps {
  tokenForm: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setTokenForm: (setter: (prev: any) => any) => void;
}

const ERC3525Config: React.FC<ERC3525ConfigProps> = ({
  tokenForm,
  handleInputChange,
  setTokenForm,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-medium">
        ERC-3525 Semi-Fungible Token Configuration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., SemiFungibleToken"
            value={tokenForm.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="e.g., SFT"
            value={tokenForm.symbol}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tokenId">Token ID</Label>
          <Input
            id="tokenId"
            type="number"
            min="1"
            placeholder="1"
            value={tokenForm.metadata.tokenId || "1"}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  tokenId: e.target.value,
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot">Slot</Label>
          <Input
            id="slot"
            type="number"
            min="1"
            placeholder="1"
            value={tokenForm.metadata.slot || "1"}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  slot: e.target.value,
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            min="0"
            placeholder="100"
            value={tokenForm.metadata.value || "100"}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  value: e.target.value,
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nav">NAV (Net Asset Value)</Label>
          <Input
            id="nav"
            type="number"
            min="0"
            step="0.01"
            placeholder="1.00"
            value={tokenForm.metadata.nav || "1.00"}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  nav: e.target.value,
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerAddress">Owner Address (ETH Wallet)</Label>
          <Input
            id="ownerAddress"
            placeholder="0x..."
            value={tokenForm.metadata.ownerAddress || ""}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  ownerAddress: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Advanced Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="splitMerge"
              checked={tokenForm.metadata.splitMerge || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    splitMerge: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="splitMerge">Split/Merge Functionality</Label>
              <p className="text-xs text-muted-foreground">
                Enable dynamic token management
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="redeemableValue"
              checked={tokenForm.metadata.redeemableValue || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    redeemableValue: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="redeemableValue">Redeemable Value</Label>
              <p className="text-xs text-muted-foreground">
                Set rules for cashing out
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="expiration"
              checked={tokenForm.metadata.expiration || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    expiration: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="expiration">Expiration</Label>
              <p className="text-xs text-muted-foreground">
                Auto-revoke tokens on a set date
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Token Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mintable"
              checked={tokenForm.metadata.mintable || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    mintable: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="mintable">Mintable</Label>
              <p className="text-xs text-muted-foreground">
                Allow creation of new tokens
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="burnable"
              checked={tokenForm.metadata.burnable || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    burnable: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="burnable">Burnable</Label>
              <p className="text-xs text-muted-foreground">
                Allow tokens to be destroyed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pausable"
              checked={tokenForm.metadata.pausable || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    pausable: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="pausable">Pausable</Label>
              <p className="text-xs text-muted-foreground">
                Enable emergency stop functionality
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transferRestrictions"
              checked={tokenForm.metadata.transferRestrictions || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    transferRestrictions: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="transferRestrictions">
                Transfer Restrictions
              </Label>
              <p className="text-xs text-muted-foreground">
                Limit transfers based on rules
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6 border-t pt-6">
        <h4 className="font-medium">ERC-3525 Metadata Editor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="slotDescription">Slot Description*</Label>
            <Input
              id="slotDescription"
              placeholder="Description of this slot"
              value={tokenForm.metadata.slotDescription || ""}
              onChange={(e) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    slotDescription: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueUnit">Value Unit*</Label>
            <Input
              id="valueUnit"
              placeholder="e.g., USD, Shares, Points"
              value={tokenForm.metadata.valueUnit || ""}
              onChange={(e) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    valueUnit: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowsValueTransfer"
              checked={tokenForm.metadata.allowsValueTransfer !== false} // Default to true
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    allowsValueTransfer: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="allowsValueTransfer">Allows Value Transfer</Label>
              <p className="text-xs text-muted-foreground">
                Enable transferring value between tokens
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates for structured products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        <div className="space-y-2">
          <Label htmlFor="issuanceDate">Issuance Date</Label>
          <Input
            id="issuanceDate"
            type="date"
            value={tokenForm.metadata.issuanceDate}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  issuanceDate: e.target.value,
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maturityDate">Maturity Date</Label>
          <Input
            id="maturityDate"
            type="date"
            value={tokenForm.metadata.maturityDate}
            onChange={(e) =>
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  maturityDate: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>

      {/* Tranche Configuration for structured products */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tranche Configuration</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newId =
                tokenForm.metadata.tranches.length > 0
                  ? Math.max(...tokenForm.metadata.tranches.map((t) => t.id)) +
                    1
                  : 1;
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  tranches: [
                    ...prev.metadata.tranches,
                    {
                      id: newId,
                      name: `Tranche ${newId}`,
                      value: 0,
                      interestRate: 0,
                    },
                  ],
                },
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Tranche
          </Button>
        </div>

        <div className="space-y-2">
          {tokenForm.metadata.tranches.length === 0 ? (
            <div className="text-center py-4 border rounded-md">
              <p className="text-muted-foreground">
                No tranches defined. Add a tranche to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tranche Name</TableHead>
                    <TableHead>Slot ID</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Interest Rate (%)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenForm.metadata.tranches.map((tranche, index) => (
                    <TableRow key={tranche.id}>
                      <TableCell>
                        <Input
                          value={tranche.name}
                          onChange={(e) => {
                            const updatedTranches = [
                              ...tokenForm.metadata.tranches,
                            ];
                            updatedTranches[index].name = e.target.value;
                            setTokenForm((prev) => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                tranches: updatedTranches,
                              },
                            }));
                          }}
                        />
                      </TableCell>
                      <TableCell>{tranche.id}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={tranche.value}
                          onChange={(e) => {
                            const updatedTranches = [
                              ...tokenForm.metadata.tranches,
                            ];
                            updatedTranches[index].value =
                              parseInt(e.target.value) || 0;
                            setTokenForm((prev) => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                tranches: updatedTranches,
                              },
                            }));
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={tranche.interestRate}
                          onChange={(e) => {
                            const updatedTranches = [
                              ...tokenForm.metadata.tranches,
                            ];
                            updatedTranches[index].interestRate =
                              parseFloat(e.target.value) || 0;
                            setTokenForm((prev) => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                tranches: updatedTranches,
                              },
                            }));
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updatedTranches =
                              tokenForm.metadata.tranches.filter(
                                (_, i) => i !== index,
                              );
                            setTokenForm((prev) => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                tranches: updatedTranches,
                              },
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Tranche summary */}
          {tokenForm.metadata.tranches.length > 0 && (
            <div className="flex justify-between items-center mt-4 p-3 bg-muted/20 rounded-md">
              <span>
                Total Value:{" "}
                {tokenForm.metadata.tranches
                  .reduce((sum, t) => sum + t.value, 0)
                  .toLocaleString()}
              </span>
              <span
                className={
                  tokenForm.metadata.tranches.reduce(
                    (sum, t) => sum + t.value,
                    0,
                  ) !== tokenForm.totalSupply
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {tokenForm.metadata.tranches.reduce(
                  (sum, t) => sum + t.value,
                  0,
                ) === tokenForm.totalSupply
                  ? "✓ Matches total supply"
                  : `⚠️ Doesn't match total supply (${tokenForm.totalSupply.toLocaleString()})`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ERC3525Config;
