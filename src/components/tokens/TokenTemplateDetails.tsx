import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";

interface TokenTemplateDetailsProps {
  product: string;
  isAlternative: boolean;
  onConfigure: () => void;
}

// Define the token standards that need to be configured for each product template
const TOKEN_STANDARDS_CONFIG: Record<string, Record<string, string[]>> = {
  "Structured Products": {
    primary: ["ERC-1400", "ERC-20"],
    alternative: ["ERC-1400", "ERC-3525", "ERC-20"],
  },
  Equity: {
    primary: ["ERC-1400", "ERC-20"],
    alternative: ["ERC-1400", "ERC-3525", "ERC-20"],
  },
  Commodities: {
    primary: ["ERC-1155", "ERC-20"],
    alternative: ["ERC-20"],
  },
  "Funds, ETFs, ETPs": {
    primary: ["ERC-1400", "ERC-4626", "ERC-20"],
    alternative: ["ERC-4626", "ERC-20"],
  },
  Bonds: {
    primary: ["ERC-1400", "ERC-20"],
    alternative: ["ERC-1400", "ERC-3525", "ERC-20"],
  },
  "Quantitative Investment Strategies": {
    primary: ["ERC-1400", "ERC-4626"],
    alternative: ["ERC-4626"],
  },
  "Private Equity": {
    primary: ["ERC-1400", "ERC-20"],
    alternative: ["ERC-1400", "ERC-3525", "ERC-20"],
  },
  "Private Debt": {
    primary: ["ERC-1400", "ERC-20"],
    alternative: ["ERC-1400", "ERC-3525", "ERC-20"],
  },
  "Real Estate": {
    primary: ["ERC-1400", "ERC-3525", "ERC-20"],
    alternative: ["ERC-1400", "ERC-20"],
  },
  Energy: {
    primary: ["ERC-1400", "ERC-1155", "ERC-20"],
    alternative: ["ERC-1400", "ERC-20"],
  },
  Infrastructure: {
    primary: ["ERC-1400", "ERC-3525", "ERC-20"],
    alternative: ["ERC-1400", "ERC-20"],
  },
  "Collectibles & all other assets": {
    primary: ["ERC-721", "ERC-1155", "ERC-20"],
    alternative: ["ERC-721", "ERC-20"],
  },
  "Digital Tokenised Fund": {
    primary: ["ERC-1400", "ERC-4626", "ERC-20"],
    alternative: ["ERC-4626"],
  },
  "Custom Template": {
    primary: [
      "ERC-20",
      "ERC-721",
      "ERC-1155",
      "ERC-1400",
      "ERC-3525",
      "ERC-4626",
    ],
    alternative: [
      "ERC-20",
      "ERC-721",
      "ERC-1155",
      "ERC-1400",
      "ERC-3525",
      "ERC-4626",
    ],
  },
};

// Define descriptions for each token standard
const TOKEN_STANDARD_DESCRIPTIONS: Record<string, string> = {
  "ERC-20": "Fungible token standard for interchangeable assets",
  "ERC-721": "Non-fungible token standard for unique assets",
  "ERC-1155":
    "Multi-token standard supporting both fungible and non-fungible tokens",
  "ERC-1400": "Security token standard with compliance controls",
  "ERC-3525": "Semi-fungible token standard with slot-based value system",
  "ERC-4626": "Tokenized vault standard for yield-bearing assets",
};

const TokenTemplateDetails: React.FC<TokenTemplateDetailsProps> = ({
  product,
  isAlternative,
  onConfigure,
}) => {
  const templateType = isAlternative ? "alternative" : "primary";
  const standards = TOKEN_STANDARDS_CONFIG[product]?.[templateType] || [];

  // Get the structure string based on the product and template type
  const getStructureString = () => {
    if (product === "Commodities" && isAlternative) {
      return "ERC-20 (direct fungible commodities)";
    }

    if (
      (product === "Funds, ETFs, ETPs" ||
        product === "Digital Tokenised Fund") &&
      !isAlternative
    ) {
      return "ERC-1400 + ERC-4626 vaults can wrap ERC-20 tokens";
    }

    if (
      (product === "Funds, ETFs, ETPs" ||
        product === "Digital Tokenised Fund") &&
      isAlternative
    ) {
      return "ERC-4626 vaults can wrap ERC-20 tokens";
    }

    if (product === "Quantitative Investment Strategies" && !isAlternative) {
      return "ERC-1400 + ERC-4626 vaults";
    }

    if (product === "Quantitative Investment Strategies" && isAlternative) {
      return "ERC-4626 vaults";
    }

    if (product === "Collectibles & all other assets" && !isAlternative) {
      return "ERC-721 / ERC-1155 → ERC-20";
    }

    if (product === "Custom Template") {
      return isAlternative
        ? "Fully customizable selection"
        : "User-defined combination";
    }

    // Default case: construct from standards
    if (standards.length === 1) {
      return standards[0];
    } else if (standards.length === 2) {
      return `${standards[0]} → ${standards[1]}`;
    } else if (standards.length > 2) {
      const lastStandard = standards[standards.length - 1];
      const otherStandards = standards
        .slice(0, standards.length - 1)
        .join(" + ");
      return `${otherStandards} → ${lastStandard}`;
    }

    return "";
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{product}</CardTitle>
            <CardDescription>
              {isAlternative
                ? "Alternative (Customizable) Template"
                : "Primary (Simplified) Template"}
            </CardDescription>
          </div>
          <Badge variant={isAlternative ? "outline" : "default"}>
            {isAlternative ? "Advanced" : "Recommended"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Token Structure</h3>
            <div className="p-3 bg-muted/30 rounded-md border">
              <div className="text-lg font-medium">{getStructureString()}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              Token Standards to Configure
            </h3>
            <div className="space-y-3">
              {standards.map((standard) => (
                <div
                  key={standard}
                  className="p-3 bg-muted/30 rounded-md border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{standard}</h4>
                      <p className="text-sm text-muted-foreground">
                        {TOKEN_STANDARD_DESCRIPTIONS[standard]}
                      </p>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Conversion Mechanics</h3>
            <div className="p-3 bg-muted/30 rounded-md border">
              {standards.length > 1 ? (
                <div className="space-y-2">
                  {product === "Funds, ETFs, ETPs" ||
                  product === "Digital Tokenised Fund" ||
                  (product === "Quantitative Investment Strategies" &&
                    standards.includes("ERC-4626")) ? (
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <p className="text-sm">
                        ERC-4626 vaults wrap ERC-20 tokens to provide
                        yield-bearing functionality
                      </p>
                    </div>
                  ) : standards.includes("ERC-20") ? (
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <p className="text-sm">
                        The primary token standard is converted to ERC-20 for
                        tradability and liquidity
                      </p>
                    </div>
                  ) : null}

                  {standards.length > 2 && (
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      <p className="text-sm">
                        Multiple token standards are combined to provide
                        enhanced functionality
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm">
                  This template uses a single token standard with no conversion.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onConfigure}>Configure Token Standards</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenTemplateDetails;
