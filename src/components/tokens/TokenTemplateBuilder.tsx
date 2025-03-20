import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

import TokenTemplateSelector from "./TokenTemplateSelector";
import TokenTemplateDetails from "./TokenTemplateDetails";
import {
  ERC20Config,
  ERC721Config,
  ERC1155Config,
  ERC1400Config,
  ERC3525Config,
  ERC4626Config,
} from "./standards";

interface TokenTemplateBuilderProps {
  tokenForm: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setTokenForm: (setter: (prev: any) => any) => void;
  onSave: () => void;
}

const TokenTemplateBuilder: React.FC<TokenTemplateBuilderProps> = ({
  tokenForm,
  handleInputChange,
  setTokenForm,
  onSave,
}) => {
  const [step, setStep] = useState<"select" | "details" | "configure">(
    "select",
  );
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [isAlternative, setIsAlternative] = useState<boolean>(false);
  const [activeStandard, setActiveStandard] = useState<string>("");

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

  // Handle template selection
  const handleSelectTemplate = (product: string, alternative: boolean) => {
    setSelectedProduct(product);
    setIsAlternative(alternative);
    setStep("details");

    // Update token form with selected product and template type
    setTokenForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        product: product,
        templateType: alternative ? "alternative" : "primary",
      },
    }));
  };

  // Handle configuration
  const handleConfigure = () => {
    setStep("configure");
    const templateType = isAlternative ? "alternative" : "primary";
    const standards =
      TOKEN_STANDARDS_CONFIG[selectedProduct]?.[templateType] || [];

    if (standards.length > 0) {
      setActiveStandard(standards[0]);
    }
  };

  // Get the standards to configure based on the selected product and template type
  const getStandardsToConfig = () => {
    const templateType = isAlternative ? "alternative" : "primary";
    return TOKEN_STANDARDS_CONFIG[selectedProduct]?.[templateType] || [];
  };

  // Render the appropriate configuration component based on the active standard
  const renderConfigComponent = () => {
    switch (activeStandard) {
      case "ERC-20":
        return (
          <ERC20Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      case "ERC-721":
        return (
          <ERC721Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      case "ERC-1155":
        return (
          <ERC1155Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      case "ERC-1400":
        return (
          <ERC1400Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      case "ERC-3525":
        return (
          <ERC3525Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      case "ERC-4626":
        return (
          <ERC4626Config
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
          />
        );
      default:
        return <div>Select a token standard to configure</div>;
    }
  };

  return (
    <div className="space-y-6">
      {step === "select" && (
        <Card>
          <CardHeader>
            <CardTitle>Token Template Selection</CardTitle>
            <CardDescription>
              Choose a product category and token template structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenTemplateSelector onSelectTemplate={handleSelectTemplate} />
          </CardContent>
        </Card>
      )}

      {step === "details" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep("select")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Templates
            </Button>
          </div>

          <TokenTemplateDetails
            product={selectedProduct}
            isAlternative={isAlternative}
            onConfigure={handleConfigure}
          />
        </div>
      )}

      {step === "configure" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("details")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Template Details
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configure {selectedProduct} Token Standards</CardTitle>
              <CardDescription>
                {isAlternative
                  ? "Alternative (Customizable)"
                  : "Primary (Simplified)"}{" "}
                Template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeStandard} onValueChange={setActiveStandard}>
                <TabsList className="mb-4">
                  {getStandardsToConfig().map((standard) => (
                    <TabsTrigger key={standard} value={standard}>
                      {standard}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="border rounded-lg p-4">
                  {renderConfigComponent()}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={onSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Token Configuration
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TokenTemplateBuilder;
