import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Plus, Check } from "lucide-react";

// Define the product template structure
interface TokenTemplate {
  name: string;
  description: string;
  primary: {
    structure: string;
    description: string;
  };
  alternative: {
    structure: string;
    description: string;
  };
}

// Define the product categories
const PRODUCT_CATEGORIES = [
  {
    name: "Traditional Assets",
    products: [
      "Structured Products",
      "Equity",
      "Commodities",
      "Funds, ETFs, ETPs",
      "Bonds",
      "Quantitative Investment Strategies",
    ],
  },
  {
    name: "Alternative Assets",
    products: [
      "Private Equity",
      "Private Debt",
      "Real Estate",
      "Energy",
      "Infrastructure",
      "Collectibles & all other assets",
    ],
  },
  {
    name: "Digital Assets",
    products: ["Digital Tokenised Fund"],
  },
];

// Define the token templates for each product
const TOKEN_TEMPLATES: Record<string, TokenTemplate> = {
  "Structured Products": {
    name: "Structured Products",
    description:
      "Regulatory compliance, issuer control, and enhanced liquidity.",
    primary: {
      structure: "ERC-1400 → ERC-20",
      description:
        "Default token structure designed for ease of compliance, investor control, and liquidity.",
    },
    alternative: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Advanced token configuration allowing for additional features such as fractional ownership.",
    },
  },
  Equity: {
    name: "Equity",
    description:
      "Simplified compliance, investor governance, and efficient secondary market liquidity.",
    primary: {
      structure: "ERC-1400 → ERC-20",
      description:
        "Default token structure designed for ease of compliance, investor control, and liquidity.",
    },
    alternative: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Advanced token configuration allowing for additional features such as fractional ownership.",
    },
  },
  Commodities: {
    name: "Commodities",
    description:
      "Batch efficiency, fractionalization, and improved tradability.",
    primary: {
      structure: "ERC-1155 → ERC-20",
      description:
        "Default token structure designed for batch efficiency and fractionalization.",
    },
    alternative: {
      structure: "ERC-20 (direct fungible commodities)",
      description: "Direct fungible token implementation for commodities.",
    },
  },
  "Funds, ETFs, ETPs": {
    name: "Funds, ETFs, ETPs",
    description:
      "Automated yield management, clear NAV calculations, and compliance with fund structures.",
    primary: {
      structure: "ERC-1400 + ERC-4626 vaults can wrap ERC-20 tokens",
      description:
        "Default token structure designed for automated yield management and compliance.",
    },
    alternative: {
      structure: "ERC-4626 vaults can wrap ERC-20 tokens",
      description: "Simplified vault structure for wrapping ERC-20 tokens.",
    },
  },
  Bonds: {
    name: "Bonds",
    description:
      "Clear issuer control, enhanced compliance, and seamless liquidity in debt markets.",
    primary: {
      structure: "ERC-1400 → ERC-20",
      description:
        "Default token structure designed for issuer control and compliance.",
    },
    alternative: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Advanced token configuration allowing for additional features such as fractional ownership.",
    },
  },
  "Quantitative Investment Strategies": {
    name: "Quantitative Investment Strategies",
    description:
      "Efficient management, compliance, and seamless yield strategy integration.",
    primary: {
      structure: "ERC-1400 + ERC-4626 vaults",
      description:
        "Default token structure designed for efficient management and yield strategy integration.",
    },
    alternative: {
      structure: "ERC-4626 vaults",
      description: "Simplified vault structure for yield strategy integration.",
    },
  },
  "Private Equity": {
    name: "Private Equity",
    description:
      "Regulatory adherence, controlled investor restrictions, and fractional liquidity.",
    primary: {
      structure: "ERC-1400 → ERC-20",
      description:
        "Default token structure designed for regulatory adherence and controlled investor restrictions.",
    },
    alternative: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Advanced token configuration allowing for additional features such as fractional ownership.",
    },
  },
  "Private Debt": {
    name: "Private Debt",
    description:
      "Issuer-controlled compliance, fractional tradability, and efficient debt issuance.",
    primary: {
      structure: "ERC-1400 → ERC-20",
      description:
        "Default token structure designed for issuer-controlled compliance and efficient debt issuance.",
    },
    alternative: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Advanced token configuration allowing for additional features such as fractional ownership.",
    },
  },
  "Real Estate": {
    name: "Real Estate",
    description:
      "Strong compliance controls, flexible fractional ownership, and improved asset tokenization.",
    primary: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Default token structure designed for strong compliance controls and flexible fractional ownership.",
    },
    alternative: {
      structure: "ERC-1400 → ERC-20",
      description: "Simplified token structure for compliance and liquidity.",
    },
  },
  Energy: {
    name: "Energy",
    description:
      "Batch management, compliance, and optimized market trading efficiency.",
    primary: {
      structure: "ERC-1400 + ERC-1155 → ERC-20",
      description:
        "Default token structure designed for batch management and compliance.",
    },
    alternative: {
      structure: "ERC-1400 → ERC-20",
      description: "Simplified token structure for compliance and liquidity.",
    },
  },
  Infrastructure: {
    name: "Infrastructure",
    description:
      "Compliance for large-scale projects, fractionalized infrastructure investment.",
    primary: {
      structure: "ERC-1400 + ERC-3525 → ERC-20",
      description:
        "Default token structure designed for compliance and fractionalized infrastructure investment.",
    },
    alternative: {
      structure: "ERC-1400 → ERC-20",
      description: "Simplified token structure for compliance and liquidity.",
    },
  },
  "Collectibles & all other assets": {
    name: "Collectibles & Other Assets",
    description:
      "Clear uniqueness, fractional tradability, and optimized market liquidity for unique assets.",
    primary: {
      structure: "ERC-721 / ERC-1155 → ERC-20",
      description:
        "Default token structure designed for clear uniqueness and fractional tradability.",
    },
    alternative: {
      structure: "ERC-721 → ERC-20",
      description:
        "Simplified token structure for unique assets with liquidity.",
    },
  },
  "Digital Tokenised Fund": {
    name: "Digital Tokenized Fund",
    description:
      "Efficient yield management, compliance, and seamless integration with fund strategies.",
    primary: {
      structure: "ERC-1400 + ERC-4626 vaults can wrap ERC-20 tokens",
      description:
        "Default token structure designed for efficient yield management and compliance.",
    },
    alternative: {
      structure: "ERC-4626 vaults",
      description: "Simplified vault structure for yield management.",
    },
  },
};

// Add a custom template option
TOKEN_TEMPLATES["Custom Template"] = {
  name: "Custom Template",
  description: "Complete flexibility for unique tokenization models.",
  primary: {
    structure: "User-defined combination",
    description:
      "User-defined combination of ERC-20, ERC-721, ERC-1155, ERC-1400, ERC-3525, and ERC-4626.",
  },
  alternative: {
    structure: "Fully customizable selection",
    description:
      "Fully customizable selection of token standards and configurations.",
  },
};

interface TokenTemplateSelectorProps {
  onSelectTemplate: (product: string, isAlternative: boolean) => void;
}

const TokenTemplateSelector: React.FC<TokenTemplateSelectorProps> = ({
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [templateType, setTemplateType] = useState<"primary" | "alternative">(
    "primary",
  );

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct("");
  };

  // Handle product selection
  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    setTemplateType("primary"); // Reset to primary template when selecting a new product
  };

  // Handle template selection
  const handleTemplateSelect = () => {
    if (selectedProduct) {
      onSelectTemplate(selectedProduct, templateType === "alternative");
    }
  };

  // Go back to category selection
  const handleBackToCategories = () => {
    setSelectedCategory("");
    setSelectedProduct("");
  };

  // Go back to product selection
  const handleBackToProducts = () => {
    setSelectedProduct("");
  };

  return (
    <div className="space-y-6">
      {!selectedCategory ? (
        // Step 1: Category Selection
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Product Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRODUCT_CATEGORIES.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleCategorySelect(category.name)}
              >
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Available Products:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {category.products.map((product) => (
                        <Badge key={product} variant="secondary">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedProduct ? (
        // Step 2: Product Selection
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToCategories}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Categories
            </Button>
            <h2 className="text-2xl font-bold">
              Select Product Type for {selectedCategory}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCT_CATEGORIES.find(
              (c) => c.name === selectedCategory,
            )?.products.map((product) => (
              <Card
                key={product}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleProductSelect(product)}
              >
                <CardHeader>
                  <CardTitle>{product}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {TOKEN_TEMPLATES[product]?.description ||
                      "Select this product to see available templates."}
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Primary</Badge>
                      <span className="text-sm">
                        {TOKEN_TEMPLATES[product]?.primary.structure}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Alternative</Badge>
                      <span className="text-sm">
                        {TOKEN_TEMPLATES[product]?.alternative.structure}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Custom Template option */}
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleProductSelect("Custom Template")}
            >
              <CardHeader>
                <CardTitle>Custom Template</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Complete flexibility for unique tokenization models.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Create a custom token structure
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Step 3: Template Selection
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToProducts}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
            <h2 className="text-2xl font-bold">{selectedProduct}</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{TOKEN_TEMPLATES[selectedProduct]?.name}</CardTitle>
              <CardDescription>
                {TOKEN_TEMPLATES[selectedProduct]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={templateType}
                onValueChange={(value) =>
                  setTemplateType(value as "primary" | "alternative")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="primary">
                    Primary (Simplified)
                  </TabsTrigger>
                  <TabsTrigger value="alternative">
                    Alternative (Customizable)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="primary" className="mt-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">
                        Primary Token Structure
                      </h3>
                      <Badge>Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {TOKEN_TEMPLATES[selectedProduct]?.primary.description}
                    </p>

                    <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                      <div className="text-lg font-medium">
                        {TOKEN_TEMPLATES[selectedProduct]?.primary.structure}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        What this means:
                      </h4>
                      <div className="space-y-2">
                        {selectedProduct === "Funds, ETFs, ETPs" ||
                        selectedProduct === "Digital Tokenised Fund" ? (
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">
                              ERC-4626 vaults wrap ERC-20 tokens to provide
                              yield-bearing functionality
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">
                              The arrow (→) indicates conversion of one token
                              standard into ERC-20 for tradability and liquidity
                            </p>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                          <p className="text-sm">
                            This structure prioritizes ease of compliance,
                            investor control, and liquidity
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alternative" className="mt-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">
                        Alternative Token Structure
                      </h3>
                      <Badge variant="outline">Advanced</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        TOKEN_TEMPLATES[selectedProduct]?.alternative
                          .description
                      }
                    </p>

                    <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                      <div className="text-lg font-medium">
                        {
                          TOKEN_TEMPLATES[selectedProduct]?.alternative
                            .structure
                        }
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        What this means:
                      </h4>
                      <div className="space-y-2">
                        {selectedProduct === "Commodities" ? (
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">
                              Direct implementation of ERC-20 for fungible
                              commodities
                            </p>
                          </div>
                        ) : selectedProduct === "Funds, ETFs, ETPs" ||
                          selectedProduct === "Digital Tokenised Fund" ||
                          selectedProduct ===
                            "Quantitative Investment Strategies" ? (
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">
                              Simplified vault structure focusing on yield
                              management
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">
                              The plus sign (+) indicates combination of token
                              standards for enhanced functionality
                            </p>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                          <p className="text-sm">
                            This structure allows for additional features such
                            as fractional ownership, yield strategies, or unique
                            asset features
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleTemplateSelect}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Select This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TokenTemplateSelector;
