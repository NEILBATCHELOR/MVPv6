import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
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

interface BondTranche {
  id: number;
  name: string;
  principalAmount: number;
  interestRate: number; // in percentage
  maturityDate: string;
  isFixedRate: boolean;
  redemptionPenalty: number; // in percentage
  minInvestment: number;
}

interface BondsConfigProps {
  tranches: BondTranche[];
  totalSupply: number;
  kycRequired: boolean;
  whitelistEnabled: boolean;
  erc20ConversionRatio: number;
  issuerWallet: string;
  callableAfter: number; // days after issuance
  puttableAfter: number; // days after issuance
  onChange: (field: string, value: any) => void;
}

const BondsConfig: React.FC<BondsConfigProps> = ({
  tranches,
  totalSupply,
  kycRequired,
  whitelistEnabled,
  erc20ConversionRatio,
  issuerWallet,
  callableAfter,
  puttableAfter,
  onChange,
}) => {
  const addTranche = () => {
    const newId =
      tranches.length > 0 ? Math.max(...tranches.map((t) => t.id)) + 1 : 1;

    // Calculate a default maturity date 5 years from now
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + 5);

    const newTranche: BondTranche = {
      id: newId,
      name: `Tranche ${newId}`,
      principalAmount: 100000,
      interestRate: 5.0, // 5% default interest rate
      maturityDate: maturityDate.toISOString().split("T")[0],
      isFixedRate: true,
      redemptionPenalty: 2.0, // 2% early redemption penalty
      minInvestment: 1000,
    };

    onChange("tranches", [...tranches, newTranche]);
  };

  const updateTranche = (index: number, updates: Partial<BondTranche>) => {
    const updatedTranches = [...tranches];
    updatedTranches[index] = { ...updatedTranches[index], ...updates };
    onChange("tranches", updatedTranches);
  };

  const removeTranche = (index: number) => {
    const updatedTranches = tranches.filter((_, i) => i !== index);
    onChange("tranches", updatedTranches);
  };

  const totalPrincipal = tranches.reduce(
    (sum, t) => sum + t.principalAmount,
    0,
  );

  // Calculate weighted average interest rate
  const weightedInterestRate =
    tranches.length > 0
      ? tranches.reduce(
          (sum, t) => sum + t.interestRate * t.principalAmount,
          0,
        ) / totalPrincipal
      : 0;

  return (
    <div className="space-y-6">
      {/* Bond Issuer Settings */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Bond Issuer Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="issuerWallet">Issuer Wallet Address*</Label>
            <Input
              id="issuerWallet"
              placeholder="0x..."
              value={issuerWallet}
              onChange={(e) => onChange("issuerWallet", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Address that will receive principal and make interest payments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kycRequired"
              checked={kycRequired}
              onCheckedChange={(checked) => onChange("kycRequired", !!checked)}
            />
            <div>
              <Label htmlFor="kycRequired">KYC/AML Required</Label>
              <p className="text-xs text-muted-foreground">
                Require KYC verification for all bondholders
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whitelistEnabled"
              checked={whitelistEnabled}
              onCheckedChange={(checked) =>
                onChange("whitelistEnabled", !!checked)
              }
            />
            <div>
              <Label htmlFor="whitelistEnabled">Enable Whitelist</Label>
              <p className="text-xs text-muted-foreground">
                Restrict bond purchases to whitelisted addresses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bond Redemption Options */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Bond Redemption Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="callableAfter">Callable After (days)</Label>
            <Input
              id="callableAfter"
              type="number"
              min="0"
              value={callableAfter}
              onChange={(e) =>
                onChange("callableAfter", parseInt(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Days after issuance when issuer can redeem bonds early (0 for
              non-callable)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="puttableAfter">Puttable After (days)</Label>
            <Input
              id="puttableAfter"
              type="number"
              min="0"
              value={puttableAfter}
              onChange={(e) =>
                onChange("puttableAfter", parseInt(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Days after issuance when bondholder can redeem bonds early (0 for
              non-puttable)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="erc20ConversionRatio">
              ERC-20 Conversion Ratio
            </Label>
            <Input
              id="erc20ConversionRatio"
              type="number"
              min="0"
              step="0.01"
              value={erc20ConversionRatio}
              onChange={(e) =>
                onChange(
                  "erc20ConversionRatio",
                  parseFloat(e.target.value) || 1,
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              Number of ERC-20 tokens per bond token for secondary market
              liquidity
            </p>
          </div>
        </div>
      </div>

      {/* Bond Tranches Configuration */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Bond Tranches Configuration</h3>
          <Button variant="outline" size="sm" onClick={addTranche}>
            <Plus className="h-4 w-4 mr-2" /> Add Tranche
          </Button>
        </div>

        <div className="space-y-2">
          {tranches.length === 0 ? (
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
                    <TableHead>Principal Amount</TableHead>
                    <TableHead>Interest Rate (%)</TableHead>
                    <TableHead>Maturity Date</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tranches.map((tranche, index) => (
                    <TableRow key={tranche.id}>
                      <TableCell>
                        <Input
                          value={tranche.name}
                          onChange={(e) => {
                            updateTranche(index, { name: e.target.value });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={tranche.principalAmount}
                          onChange={(e) => {
                            updateTranche(index, {
                              principalAmount: parseInt(e.target.value) || 0,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={tranche.interestRate}
                          onChange={(e) => {
                            updateTranche(index, {
                              interestRate: parseFloat(e.target.value) || 0,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={tranche.maturityDate}
                          onChange={(e) => {
                            updateTranche(index, {
                              maturityDate: e.target.value,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={tranche.isFixedRate ? "fixed" : "variable"}
                          onValueChange={(value) => {
                            updateTranche(index, {
                              isFixedRate: value === "fixed",
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select rate type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Rate</SelectItem>
                            <SelectItem value="variable">
                              Variable Rate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTranche(index)}
                          disabled={tranches.length <= 1}
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

          {/* Bond summary */}
          {tranches.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Bond Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Total Principal:</p>
                  <p className="font-medium">
                    ${totalPrincipal.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">
                    Weighted Avg. Interest Rate:
                  </p>
                  <p className="font-medium">
                    {weightedInterestRate.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Earliest Maturity:</p>
                  <p className="font-medium">
                    {tranches.length > 0
                      ? new Date(
                          Math.min(
                            ...tranches.map((t) =>
                              new Date(t.maturityDate).getTime(),
                            ),
                          ),
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Latest Maturity:</p>
                  <p className="font-medium">
                    {tranches.length > 0
                      ? new Date(
                          Math.max(
                            ...tranches.map((t) =>
                              new Date(t.maturityDate).getTime(),
                            ),
                          ),
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Supply check */}
          {tranches.length > 0 && (
            <div className="flex justify-between items-center mt-4 p-3 bg-muted/20 rounded-md">
              <span>Total Principal: {totalPrincipal.toLocaleString()}</span>
              <span
                className={
                  totalPrincipal !== totalSupply
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {totalPrincipal === totalSupply
                  ? "✓ Matches total supply"
                  : `⚠️ Doesn't match total supply (${totalSupply.toLocaleString()})`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Bond Features */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Advanced Bond Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tranches.map((tranche, index) => (
            <div key={tranche.id} className="space-y-4 p-4 border rounded-md">
              <h4 className="font-medium">{tranche.name} Settings</h4>
              <div className="space-y-2">
                <Label htmlFor={`minInvestment-${tranche.id}`}>
                  Minimum Investment
                </Label>
                <Input
                  id={`minInvestment-${tranche.id}`}
                  type="number"
                  min="0"
                  value={tranche.minInvestment}
                  onChange={(e) => {
                    updateTranche(index, {
                      minInvestment: parseInt(e.target.value) || 0,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`redemptionPenalty-${tranche.id}`}>
                  Early Redemption Penalty (%)
                </Label>
                <Input
                  id={`redemptionPenalty-${tranche.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={tranche.redemptionPenalty}
                  onChange={(e) => {
                    updateTranche(index, {
                      redemptionPenalty: parseFloat(e.target.value) || 0,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Whitelist Configuration */}
      {whitelistEnabled && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-medium">Whitelist Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="whitelistUpload">Upload Whitelist (CSV)</Label>
              <div className="flex gap-2">
                <Input
                  id="whitelistUpload"
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    // In a real implementation, this would parse the CSV
                    console.log("CSV upload:", e.target.files?.[0]);
                  }}
                />
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                CSV format: Address,MaxAmount (e.g., "0x123...,10000")
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Yield Preview */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Yield Preview</h3>
        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tranches.map((tranche) => {
              // Calculate years to maturity
              const maturityDate = new Date(tranche.maturityDate);
              const today = new Date();
              const yearsToMaturity =
                (maturityDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24 * 365);

              // Calculate total interest over the bond term
              const totalInterest =
                tranche.principalAmount *
                (tranche.interestRate / 100) *
                yearsToMaturity;

              // Calculate yield to maturity (simplified)
              const ytm = tranche.interestRate; // In a real app, this would be a more complex calculation

              return (
                <div
                  key={tranche.id}
                  className="p-3 bg-white rounded-md shadow-sm"
                >
                  <h5 className="font-medium text-green-800">{tranche.name}</h5>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Interest Rate:</span>
                      <span className="font-medium">
                        {tranche.interestRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Term:</span>
                      <span className="font-medium">
                        {yearsToMaturity.toFixed(1)} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Interest:</span>
                      <span className="font-medium">
                        ${totalInterest.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">YTM:</span>
                      <span className="font-medium">{ytm.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondsConfig;
