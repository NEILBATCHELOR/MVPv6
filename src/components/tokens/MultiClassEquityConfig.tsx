import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
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
  conversionRatio: number;
  votingRights: boolean;
  dividendRights: boolean;
  transferRestrictions: boolean;
}

interface MultiClassEquityConfigProps {
  shareClasses: ShareClass[];
  totalSupply: number;
  onChange: (shareClasses: ShareClass[]) => void;
  onErc20ConversionChange: (enabled: boolean) => void;
  erc20Conversion: boolean;
}

const MultiClassEquityConfig: React.FC<MultiClassEquityConfigProps> = ({
  shareClasses,
  totalSupply,
  onChange,
  onErc20ConversionChange,
  erc20Conversion,
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
      lockupPeriod: 0,
      whitelist: [],
      conversionRatio: 1,
      votingRights: true,
      dividendRights: true,
      transferRestrictions: false,
    };

    onChange([...shareClasses, newClass]);
  };

  const updateShareClass = (index: number, updates: Partial<ShareClass>) => {
    const updatedClasses = [...shareClasses];
    updatedClasses[index] = { ...updatedClasses[index], ...updates };
    onChange(updatedClasses);
  };

  const removeShareClass = (index: number) => {
    const updatedClasses = shareClasses.filter((_, i) => i !== index);
    onChange(updatedClasses);
  };

  const totalInitialSupply = shareClasses.reduce(
    (sum, c) => sum + c.initialSupply,
    0,
  );

  return (
    <div className="space-y-4">
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
                            shareClass.dividendRights ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            updateShareClass(index, {
                              dividendRights: !shareClass.dividendRights,
                            });
                          }}
                        >
                          Dividends
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeShareClass(index)}
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

      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Whitelist Configuration</h4>
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

      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Conversion Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="erc20Conversion">Enable ERC-20 Conversion</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="erc20Conversion"
                checked={erc20Conversion}
                onCheckedChange={(checked) =>
                  onErc20ConversionChange(!!checked)
                }
              />
              <Label htmlFor="erc20Conversion">
                Allow conversion to ERC-20 for liquidity
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Each share class can have a different conversion ratio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiClassEquityConfig;
