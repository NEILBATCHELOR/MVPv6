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
import { Plus, Trash2 } from "lucide-react";

interface ERC1155ConfigProps {
  tokenForm: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setTokenForm: (setter: (prev: any) => any) => void;
}

const ERC1155Config: React.FC<ERC1155ConfigProps> = ({
  tokenForm,
  handleInputChange,
  setTokenForm,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-medium">
        ERC-1155 Multi Token Configuration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., MultiToken"
            value={tokenForm.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="e.g., MTK"
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
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Token Types</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newTokens = [...(tokenForm.metadata.tokens || [])];
              newTokens.push({
                id: newTokens.length + 1,
                type: "Fungible",
                name: `Token ${newTokens.length + 1}`,
                amount: 1000,
                maxSupply: 0,
                uri: "",
                burnable: false,
                transferable: true,
              });
              setTokenForm((prev) => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  tokens: newTokens,
                },
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Token
          </Button>
        </div>

        {!tokenForm.metadata.tokens ||
        tokenForm.metadata.tokens.length === 0 ? (
          <div className="text-center py-4 border rounded-md">
            <p className="text-muted-foreground">
              No tokens defined. Add a token to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tokenForm.metadata.tokens.map((token: any, index: number) => (
              <div key={index} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Token #{token.id}</h5>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newTokens = [...tokenForm.metadata.tokens];
                      newTokens.splice(index, 1);
                      setTokenForm((prev) => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          tokens: newTokens,
                        },
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`token-${index}-type`}>Token Type</Label>
                    <Select
                      value={token.type}
                      onValueChange={(value) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].type = value;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fungible">Fungible</SelectItem>
                        <SelectItem value="Semi-Fungible">
                          Semi-Fungible
                        </SelectItem>
                        <SelectItem value="Non-Fungible">
                          Non-Fungible
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`token-${index}-name`}>Name</Label>
                    <Input
                      id={`token-${index}-name`}
                      value={token.name}
                      onChange={(e) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].name = e.target.value;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`token-${index}-amount`}>Amount</Label>
                    <Input
                      id={`token-${index}-amount`}
                      type="number"
                      min="1"
                      value={token.amount}
                      onChange={(e) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].amount = parseInt(e.target.value) || 1;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`token-${index}-maxSupply`}>
                      Maximum Supply
                    </Label>
                    <Input
                      id={`token-${index}-maxSupply`}
                      type="number"
                      min="0"
                      placeholder="0 for unlimited"
                      value={token.maxSupply}
                      onChange={(e) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].maxSupply =
                          parseInt(e.target.value) || 0;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`token-${index}-uri`}>URI</Label>
                    <Input
                      id={`token-${index}-uri`}
                      placeholder="ipfs://"
                      value={token.uri}
                      onChange={(e) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].uri = e.target.value;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`token-${index}-burnable`}
                      checked={token.burnable}
                      onCheckedChange={(checked) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].burnable = !!checked;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                    <Label htmlFor={`token-${index}-burnable`}>Burnable</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`token-${index}-transferable`}
                      checked={token.transferable}
                      onCheckedChange={(checked) => {
                        const newTokens = [...tokenForm.metadata.tokens];
                        newTokens[index].transferable = !!checked;
                        setTokenForm((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            tokens: newTokens,
                          },
                        }));
                      }}
                    />
                    <Label htmlFor={`token-${index}-transferable`}>
                      Transferable
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <h4 className="font-medium">ERC-1155 Metadata Editor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="collectionName">Collection Name*</Label>
            <Input
              id="collectionName"
              placeholder="Collection name"
              value={tokenForm.metadata.collectionName || tokenForm.name}
              onChange={(e) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    collectionName: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="supportsBatchTransfers"
              checked={tokenForm.metadata.supportsBatchTransfers !== false} // Default to true
              onCheckedChange={(checked) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    supportsBatchTransfers: !!checked,
                  },
                }))
              }
            />
            <div>
              <Label htmlFor="supportsBatchTransfers">
                Supports Batch Transfers
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable efficient batch operations
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseUri">Custom Base Metadata URI</Label>
            <Input
              id="baseUri"
              placeholder="ipfs://"
              value={tokenForm.metadata.baseUri || ""}
              onChange={(e) =>
                setTokenForm((prev) => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    baseUri: e.target.value,
                  },
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Allows off-chain metadata link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC1155Config;
