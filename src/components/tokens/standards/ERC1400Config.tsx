import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ERC1400ConfigProps {
  tokenForm: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setTokenForm: (setter: (prev: any) => any) => void;
}

const ERC1400Config: React.FC<ERC1400ConfigProps> = ({
  tokenForm,
  handleInputChange,
  setTokenForm,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-medium">
        ERC-1400 Security Token Configuration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., SecurityToken"
            value={tokenForm.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="e.g., STKN"
            value={tokenForm.symbol}
            onChange={handleInputChange}
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
        <h4 className="font-medium">Restricted Jurisdictions</h4>
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allJurisdictions = [
                "Cuba",
                "North Korea",
                "Russia",
                "Donetsk",
                "Belarus",
                "Venezuela",
                "Democratic Republic of the Congo",
                "Lebanon",
                "Somalia",
                "Yemen",
                "Iran",
                "Syria",
                "Crimea",
                "Luhansk",
                "Myanmar",
                "Zimbabwe",
                "Iraq",
                "Libya",
                "Sudan",
              ];
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  restrictedJurisdictions: allJurisdictions,
                },
              }));
            }}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  restrictedJurisdictions: [],
                },
              }));
            }}
          >
            Deselect All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            "Cuba",
            "North Korea",
            "Russia",
            "Donetsk (Ukraine)",
            "Belarus",
            "Venezuela",
            "Democratic Republic of the Congo",
            "Lebanon",
            "Somalia",
            "Yemen",
            "Iran",
            "Syria",
            "Crimea (Ukraine)",
            "Luhansk (Ukraine)",
            "Myanmar (Burma)",
            "Zimbabwe",
            "Iraq",
            "Libya",
            "Sudan",
          ].map((jurisdiction) => (
            <div key={jurisdiction} className="flex items-center space-x-2">
              <Checkbox
                id={`jurisdiction-${jurisdiction}`}
                checked={(
                  tokenForm.metadata.restrictedJurisdictions || []
                ).includes(jurisdiction)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTokenForm((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        restrictedJurisdictions: [
                          ...(prev.metadata.restrictedJurisdictions || []),
                          jurisdiction,
                        ],
                      },
                    }));
                  } else {
                    setTokenForm((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        restrictedJurisdictions: (
                          prev.metadata.restrictedJurisdictions || []
                        ).filter((j) => j !== jurisdiction),
                      },
                    }));
                  }
                }}
              />
              <Label htmlFor={`jurisdiction-${jurisdiction}`}>
                {jurisdiction}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="issuanceDate">Issuance Date</Label>
          <Input
            id="issuanceDate"
            type="date"
            value={tokenForm.metadata.issuanceDate || ""}
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
            value={tokenForm.metadata.maturityDate || ""}
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

      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Advanced Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Limit trading to KYC-verified wallets
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lockupPeriods"
              checked={tokenForm.metadata.lockupPeriods || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    lockupPeriods: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="lockupPeriods">Lock-up Periods</Label>
              <p className="text-xs text-muted-foreground">
                Prevent early selling
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="complianceModules"
              checked={tokenForm.metadata.complianceModules || false}
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    complianceModules: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="complianceModules">Compliance Modules</Label>
              <p className="text-xs text-muted-foreground">
                Auto-restrict based on investor type
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
        </div>
      </div>

      <div className="space-y-4 mt-6 border-t pt-6">
        <h4 className="font-medium">ERC-1400 Metadata Editor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="securityType">Security Type*</Label>
            <Select
              value={tokenForm.metadata.securityType || ""}
              onValueChange={(value) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    securityType: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select security type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="derivative">Derivative</SelectItem>
                <SelectItem value="fund">Fund</SelectItem>
                <SelectItem value="reit">REIT</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuerName">Issuer Name*</Label>
            <Input
              id="issuerName"
              placeholder="Legal entity name"
              value={tokenForm.metadata.issuerName || ""}
              onChange={(e) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    issuerName: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kycRequired"
              checked={tokenForm.metadata.kycRequired !== false} // Default to true
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    kycRequired: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="kycRequired">KYC Required</Label>
              <p className="text-xs text-muted-foreground">
                Require KYC verification for token holders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC1400Config;
