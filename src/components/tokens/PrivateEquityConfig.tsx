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

interface ShareClass {
  id: number;
  name: string;
  initialSupply: number;
  lockupPeriod: number; // in days
  whitelist: string[];
  votingRights: boolean;
  distributionRights: boolean;
  distributionPriority: number; // 1 = highest priority
  transferRestrictions: boolean;
}

interface ValuationSchedule {
  frequency: "monthly" | "quarterly" | "biannually" | "annually" | "custom";
  method: "dcf" | "marketComparables" | "assetBased" | "custom";
  customFrequencyDays?: number;
  nextValuationDate: string;
}

interface PrivateEquityConfigProps {
  shareClasses: ShareClass[];
  totalSupply: number;
  valuationSchedule: ValuationSchedule;
  kycRequired: boolean;
  lockupPeriod: number;
  erc20ConversionRatio: number;
  dividendFrequency:
    | "quarterly"
    | "biannually"
    | "annually"
    | "onExit"
    | "custom";
  reinvestmentAllowed: boolean;
  minimumInvestment: number;
  votingThreshold: number;
  onChange: (field: string, value: any) => void;
}

const PrivateEquityConfig: React.FC<PrivateEquityConfigProps> = ({
  shareClasses,
  totalSupply,
  valuationSchedule,
  kycRequired,
  lockupPeriod,
  erc20ConversionRatio,
  dividendFrequency,
  reinvestmentAllowed,
  minimumInvestment,
  votingThreshold,
  onChange,
}) => {
  const addShareClass = () => {
    const newId =
      shareClasses.length > 0
        ? Math.max(...shareClasses.map((c) => c.id)) + 1
        : 1;

    const newClass: ShareClass = {
      id: newId,
      name: `Class ${String.fromCharCode(64 + newId)}`,
      initialSupply: 100000,
      lockupPeriod: lockupPeriod || 365, // Default to 1 year
      whitelist: [],
      votingRights: newId === 1, // Only first class has voting rights by default
      distributionRights: true,
      distributionPriority: newId, // Priority matches class ID
      transferRestrictions: true,
    };

    onChange("shareClasses", [...shareClasses, newClass]);
  };

  const updateShareClass = (index: number, updates: Partial<ShareClass>) => {
    const updatedClasses = [...shareClasses];
    updatedClasses[index] = { ...updatedClasses[index], ...updates };
    onChange("shareClasses", updatedClasses);
  };

  const removeShareClass = (index: number) => {
    const updatedClasses = shareClasses.filter((_, i) => i !== index);
    onChange("shareClasses", updatedClasses);
  };

  const totalInitialSupply = shareClasses.reduce(
    (sum, c) => sum + c.initialSupply,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Compliance Settings */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Compliance Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kycRequired"
              checked={kycRequired}
              onCheckedChange={(checked) => onChange("kycRequired", !!checked)}
            />
            <div>
              <Label htmlFor="kycRequired">KYC/AML Required</Label>
              <p className="text-xs text-muted-foreground">
                Require KYC verification for all token holders
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lockupPeriod">Global Lockup Period (days)</Label>
            <Input
              id="lockupPeriod"
              type="number"
              min="0"
              value={lockupPeriod}
              onChange={(e) =>
                onChange("lockupPeriod", parseInt(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Default period during which tokens cannot be transferred
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumInvestment">Minimum Investment</Label>
            <Input
              id="minimumInvestment"
              type="number"
              min="0"
              value={minimumInvestment}
              onChange={(e) =>
                onChange("minimumInvestment", parseInt(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Minimum token amount per investor
            </p>
          </div>
        </div>
      </div>

      {/* Share Classes Configuration */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Share Classes Configuration</h3>
          <Button variant="outline" size="sm" onClick={addShareClass}>
            <Plus className="h-4 w-4 mr-2" /> Add Share Class
          </Button>
        </div>

        <div className="space-y-2">
          {shareClasses.length === 0 ? (
            <div className="text-center py-4 border rounded-md">
              <p className="text-muted-foreground">
                No share classes defined. Add a share class to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Initial Supply</TableHead>
                    <TableHead>Lockup Period (days)</TableHead>
                    <TableHead>Rights & Restrictions</TableHead>
                    <TableHead>Distribution Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shareClasses.map((shareClass, index) => (
                    <TableRow key={shareClass.id}>
                      <TableCell>
                        <Input
                          value={shareClass.name}
                          onChange={(e) => {
                            updateShareClass(index, { name: e.target.value });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={shareClass.initialSupply}
                          onChange={(e) => {
                            updateShareClass(index, {
                              initialSupply: parseInt(e.target.value) || 0,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={shareClass.lockupPeriod}
                          onChange={(e) => {
                            updateShareClass(index, {
                              lockupPeriod: parseInt(e.target.value) || 0,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={
                              shareClass.votingRights ? "default" : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              updateShareClass(index, {
                                votingRights: !shareClass.votingRights,
                              });
                            }}
                          >
                            Voting
                          </Badge>
                          <Badge
                            variant={
                              shareClass.distributionRights
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              updateShareClass(index, {
                                distributionRights:
                                  !shareClass.distributionRights,
                              });
                            }}
                          >
                            Distributions
                          </Badge>
                          <Badge
                            variant={
                              shareClass.transferRestrictions
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              updateShareClass(index, {
                                transferRestrictions:
                                  !shareClass.transferRestrictions,
                              });
                            }}
                          >
                            Restricted
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={shareClass.distributionPriority.toString()}
                          onValueChange={(value) => {
                            updateShareClass(index, {
                              distributionPriority: parseInt(value),
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Highest (1)</SelectItem>
                            <SelectItem value="2">High (2)</SelectItem>
                            <SelectItem value="3">Medium (3)</SelectItem>
                            <SelectItem value="4">Low (4)</SelectItem>
                            <SelectItem value="5">Lowest (5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeShareClass(index)}
                          disabled={shareClasses.length <= 1}
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

          {/* Share class summary */}
          {shareClasses.length > 0 && (
            <div className="flex justify-between items-center mt-4 p-3 bg-muted/20 rounded-md">
              <span>Total Supply: {totalInitialSupply.toLocaleString()}</span>
              <span
                className={
                  totalInitialSupply !== totalSupply
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {totalInitialSupply === totalSupply
                  ? "✓ Matches total supply"
                  : `⚠️ Doesn't match total supply (${totalSupply.toLocaleString()})`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Valuation Mechanism */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Valuation Mechanism</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="valuationFrequency">Valuation Frequency</Label>
            <Select
              value={valuationSchedule.frequency}
              onValueChange={(value) =>
                onChange("valuationSchedule", {
                  ...valuationSchedule,
                  frequency: value as ValuationSchedule["frequency"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="biannually">Bi-annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {valuationSchedule.frequency === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customFrequencyDays">
                Custom Frequency (days)
              </Label>
              <Input
                id="customFrequencyDays"
                type="number"
                min="1"
                value={valuationSchedule.customFrequencyDays || 90}
                onChange={(e) =>
                  onChange("valuationSchedule", {
                    ...valuationSchedule,
                    customFrequencyDays: parseInt(e.target.value) || 90,
                  })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="valuationMethod">Valuation Method</Label>
            <Select
              value={valuationSchedule.method}
              onValueChange={(value) =>
                onChange("valuationSchedule", {
                  ...valuationSchedule,
                  method: value as ValuationSchedule["method"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dcf">Discounted Cash Flow</SelectItem>
                <SelectItem value="marketComparables">
                  Market Comparables
                </SelectItem>
                <SelectItem value="assetBased">Asset-Based</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextValuationDate">Next Valuation Date</Label>
            <Input
              id="nextValuationDate"
              type="date"
              value={valuationSchedule.nextValuationDate}
              onChange={(e) =>
                onChange("valuationSchedule", {
                  ...valuationSchedule,
                  nextValuationDate: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Governance Structure */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Governance Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="votingThreshold">
              Proposal Threshold (% of total supply)
            </Label>
            <Input
              id="votingThreshold"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={votingThreshold}
              onChange={(e) =>
                onChange("votingThreshold", parseFloat(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Minimum percentage of tokens required to submit proposals
            </p>
          </div>
        </div>
      </div>

      {/* Profit Distribution */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Profit Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dividendFrequency">Dividend Frequency</Label>
            <Select
              value={dividendFrequency}
              onValueChange={(value) =>
                onChange("dividendFrequency", value as typeof dividendFrequency)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="biannually">Bi-annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="onExit">On Exit Only</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="reinvestmentAllowed"
              checked={reinvestmentAllowed}
              onCheckedChange={(checked) =>
                onChange("reinvestmentAllowed", !!checked)
              }
            />
            <div>
              <Label htmlFor="reinvestmentAllowed">Allow Reinvestment</Label>
              <p className="text-xs text-muted-foreground">
                Allow investors to reinvest distributions back into the fund
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liquidity Options */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Liquidity Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Number of ERC-20 tokens per private equity token
            </p>
          </div>
        </div>
      </div>

      {/* Whitelist Configuration */}
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
                  // and update the whitelist for each share class
                  console.log("CSV upload:", e.target.files?.[0]);
                }}
              />
              <Button variant="outline" size="sm">
                Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              CSV format: ShareClass,Address (e.g., "Class A,0x123...")
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateEquityConfig;
