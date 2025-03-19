import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ERC4626ConfigProps {
  tokenForm: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setTokenForm: (setter: (prev: any) => any) => void;
}

const ERC4626Config: React.FC<ERC4626ConfigProps> = ({
  tokenForm,
  handleInputChange,
  setTokenForm,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-medium">
        ERC-4626 Tokenized Vault Configuration
      </h3>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-md">Token Definition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Vault Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Yield Vault"
                value={tokenForm.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="e.g., yVAULT"
                value={tokenForm.symbol}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAssets">Total Assets</Label>
              <Input
                id="totalAssets"
                type="number"
                min="0"
                placeholder="0"
                value={tokenForm.metadata.totalAssets || "0"}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      totalAssets: e.target.value,
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
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-md">Vault Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deposit"
                checked={tokenForm.metadata.deposit !== false} // Default to true
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      deposit: !!checked,
                    },
                  }))
                }
              />
              <div>
                <Label htmlFor="deposit">Deposit</Label>
                <p className="text-xs text-muted-foreground">
                  Deposit assets into vault
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="withdraw"
                checked={tokenForm.metadata.withdraw !== false} // Default to true
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      withdraw: !!checked,
                    },
                  }))
                }
              />
              <div>
                <Label htmlFor="withdraw">Withdraw</Label>
                <p className="text-xs text-muted-foreground">
                  Withdraw from vault
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="convertToShares"
                checked={tokenForm.metadata.convertToShares !== false} // Default to true
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      convertToShares: !!checked,
                    },
                  }))
                }
              />
              <div>
                <Label htmlFor="convertToShares">Convert to Shares</Label>
                <p className="text-xs text-muted-foreground">
                  Convert deposits to vault shares
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="convertToAssets"
                checked={tokenForm.metadata.convertToAssets !== false} // Default to true
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      convertToAssets: !!checked,
                    },
                  }))
                }
              />
              <div>
                <Label htmlFor="convertToAssets">Convert to Assets</Label>
                <p className="text-xs text-muted-foreground">
                  Convert shares to underlying assets
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maxWithdraw"
                checked={tokenForm.metadata.maxWithdraw !== false} // Default to true
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      maxWithdraw: !!checked,
                    },
                  }))
                }
              />
              <div>
                <Label htmlFor="maxWithdraw">Max Withdraw</Label>
                <p className="text-xs text-muted-foreground">
                  Get max allowable withdrawal
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-md">Token Features</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-md">ERC-4626 Metadata Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="underlyingAsset">Underlying Asset*</Label>
              <Select
                value={tokenForm.metadata.underlyingAsset || ""}
                onValueChange={(value) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      underlyingAsset: value,
                    },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="WBTC">WBTC</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yieldStrategy">Yield Strategy*</Label>
              <Select
                value={tokenForm.metadata.yieldStrategy || ""}
                onValueChange={(value) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      yieldStrategy: value,
                    },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LENDING">Lending</SelectItem>
                  <SelectItem value="STAKING">Staking</SelectItem>
                  <SelectItem value="LIQUIDITY">Liquidity Provision</SelectItem>
                  <SelectItem value="YIELD_FARMING">Yield Farming</SelectItem>
                  <SelectItem value="ARBITRAGE">Arbitrage</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="managementFee">Management Fee (%)</Label>
              <Input
                id="managementFee"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="2.0"
                value={tokenForm.metadata.managementFee || ""}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      managementFee: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="performanceFee">Performance Fee (%)</Label>
              <Input
                id="performanceFee"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="20.0"
                value={tokenForm.metadata.performanceFee || ""}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      performanceFee: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-md">Fund Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min-deposit">Minimum Deposit</Label>
              <Input
                id="min-deposit"
                type="number"
                min="0"
                placeholder="0"
                value={tokenForm.metadata.minDeposit || ""}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      minDeposit: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-deposit">Maximum Deposit</Label>
              <Input
                id="max-deposit"
                type="number"
                min="0"
                placeholder="No limit"
                value={tokenForm.metadata.maxDeposit || ""}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      maxDeposit: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redemption-notice">
                Redemption Notice Period (Days)
              </Label>
              <Input
                id="redemption-notice"
                type="number"
                min="0"
                placeholder="30"
                value={tokenForm.metadata.redemptionNoticeDays || "30"}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      redemptionNoticeDays: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="erc20-conversion">ERC-20 Conversion Rate</Label>
              <Input
                id="erc20-conversion"
                type="number"
                min="0"
                step="0.01"
                placeholder="1.0"
                value={tokenForm.metadata.erc20ConversionRate || "1.0"}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      erc20ConversionRate: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nav-oracle"
                checked={tokenForm.metadata.navOracleEnabled || false}
                onCheckedChange={(checked) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      navOracleEnabled: !!checked,
                    },
                  }))
                }
              />
              <Label htmlFor="nav-oracle">
                Enable Oracle-based NAV Calculation
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              When enabled, NAV will be calculated automatically using price
              oracles. Otherwise, NAV will be updated manually by the fund
              manager.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERC4626Config;
