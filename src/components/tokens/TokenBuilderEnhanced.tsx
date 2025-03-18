import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Coins,
  Plus,
  Save,
  Trash2,
  Code,
  FileText,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import MultiClassEquityConfig from "./MultiClassEquityConfig";

interface TokenBuilderProps {
  projectId?: string;
}

interface Token {
  id: string;
  project_id: string;
  name: string;
  symbol: string;
  decimals: number;
  standard: string;
  blocks: any;
  metadata: any;
  status: string;
  contract_preview?: string;
  created_at: string;
  updated_at: string;
}

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

interface TokenTemplate {
  name: string;
  description: string;
  category: string;
  standard: string;
  defaultBlocks: any;
  icon: React.ReactNode;
}

const TOKEN_STANDARDS = [
  {
    value: "ERC-20",
    label: "ERC-20 (Fungible Token)",
    description:
      "Standard for fungible tokens where each token is identical and interchangeable",
    mandatoryFunctions: [
      "totalSupply()",
      "balanceOf(address)",
      "transfer(address,uint256)",
      "transferFrom(address,address,uint256)",
      "approve(address,uint256)",
      "allowance(address,address)",
    ],
    optionalFunctions: ["name()", "symbol()", "decimals()"],
    configOptions: [
      "Initial Supply",
      "Minting/Burning",
      "Pausable",
      "Access Control",
    ],
  },
  {
    value: "ERC-721",
    label: "ERC-721 (Non-Fungible Token)",
    description:
      "Standard for non-fungible tokens where each token is unique and not interchangeable",
    mandatoryFunctions: [
      "balanceOf(address)",
      "ownerOf(uint256)",
      "safeTransferFrom(address,address,uint256)",
      "transferFrom(address,address,uint256)",
      "approve(address,uint256)",
      "getApproved(uint256)",
      "setApprovalForAll(address,bool)",
      "isApprovedForAll(address,address)",
    ],
    optionalFunctions: ["name()", "symbol()", "tokenURI(uint256)"],
    configOptions: ["Base URI", "Minting", "Royalties", "Metadata Storage"],
  },
  {
    value: "ERC-1155",
    label: "ERC-1155 (Multi Token)",
    description:
      "Standard for contracts that manage multiple token types (both fungible and non-fungible)",
    mandatoryFunctions: [
      "balanceOf(address,uint256)",
      "balanceOfBatch(address[],uint256[])",
      "setApprovalForAll(address,bool)",
      "isApprovedForAll(address,address)",
      "safeTransferFrom(address,address,uint256,uint256,bytes)",
      "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
    ],
    optionalFunctions: ["uri(uint256)"],
    configOptions: ["URI", "Minting", "Batch Operations", "Supply Tracking"],
  },
  {
    value: "ERC-1400",
    label: "ERC-1400 (Security Token)",
    description:
      "Standard for security tokens with transfer restrictions and compliance controls",
    mandatoryFunctions: [
      "getDocument(bytes32)",
      "setDocument(bytes32,string,bytes32)",
      "isControllable()",
      "isIssuable()",
      "canTransferByPartition(bytes32,address,address,uint256,bytes)",
      "transferByPartition(bytes32,address,uint256,bytes)",
    ],
    optionalFunctions: [
      "controllers()",
      "authorizeOperator(address)",
      "revokeOperator(address)",
      "isOperator(address,address)",
    ],
    configOptions: [
      "Partitions",
      "Transfer Restrictions",
      "Document Management",
      "Compliance Controls",
    ],
  },
  {
    value: "ERC-1400 + ERC-3643",
    label: "ERC-1400 + ERC-3643 (Enhanced Security Token)",
    description:
      "Extended security token standard with advanced compliance features and multiple share classes",
    mandatoryFunctions: [
      "getDocument(bytes32)",
      "setDocument(bytes32,string,bytes32)",
      "isControllable()",
      "isIssuable()",
      "canTransferByPartition(bytes32,address,address,uint256,bytes)",
      "transferByPartition(bytes32,address,uint256,bytes)",
      "getShareClass(uint256)",
      "balanceOf(address,uint256)",
    ],
    optionalFunctions: [
      "controllers()",
      "authorizeOperator(address)",
      "revokeOperator(address)",
      "isOperator(address,address)",
      "votingPower(address)",
      "distributeDividends(uint256)",
    ],
    configOptions: [
      "Share Classes",
      "Transfer Restrictions",
      "Document Management",
      "Compliance Controls",
      "Voting Rights",
      "Dividend Rights",
    ],
  },
  {
    value: "ERC-3525",
    label: "ERC-3525 (Semi-Fungible Token)",
    description:
      "Standard for semi-fungible tokens with slot-based value system",
    mandatoryFunctions: [
      "balanceOf(address)",
      "ownerOf(uint256)",
      "transferFrom(address,address,uint256)",
      "slotOf(uint256)",
      "valueDecimals()",
      "valueOf(uint256)",
      "transferValueFrom(uint256,uint256,uint256)",
    ],
    optionalFunctions: ["name()", "symbol()", "slotURI(uint256)"],
    configOptions: ["Slots", "Values", "Decimals", "Tranches"],
  },
  {
    value: "ERC-4626",
    label: "ERC-4626 (Tokenized Vault)",
    description: "Standard for tokenized yield-bearing vaults",
    mandatoryFunctions: [
      "asset()",
      "totalAssets()",
      "convertToShares(uint256)",
      "convertToAssets(uint256)",
      "maxDeposit(address)",
      "previewDeposit(uint256)",
      "deposit(uint256,address)",
      "maxMint(address)",
      "previewMint(uint256)",
      "mint(uint256,address)",
      "maxWithdraw(address)",
      "previewWithdraw(uint256)",
      "withdraw(uint256,address,address)",
      "maxRedeem(address)",
      "previewRedeem(uint256)",
      "redeem(uint256,address,address)",
    ],
    optionalFunctions: [],
    configOptions: [
      "Underlying Asset",
      "Yield Strategy",
      "Deposit/Withdrawal Limits",
      "Fee Structure",
    ],
  },
];

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

const TOKEN_TEMPLATES: TokenTemplate[] = [
  {
    name: "Equity Token",
    description: "Standard equity token with voting rights and dividends",
    category: "Equity",
    standard: "ERC-1400",
    defaultBlocks: {
      compliance: ["KYC", "AML", "Accredited Investors Only"],
      features: ["Voting", "Dividends", "Transfer Restrictions"],
      governance: ["Board Approval"],
    },
    icon: <Coins className="h-8 w-8 text-blue-500" />,
  },
  {
    name: "Multi-Class Equity Token",
    description: "Equity token with multiple share classes, each with configurable rights and restrictions",
    category: "Equity",
    standard: "ERC-1400 + ERC-3643",
    defaultBlocks: {
      compliance: ["KYC", "AML", "Accredited Investors Only", "Jurisdiction Restrictions"],
      features: ["Voting", "Dividends", "Transfer Restrictions", "Share Classes"],
      governance: ["Board Approval", "Multi-Signature"],
    },
    icon: <Coins className="h-8 w-8 text-blue-700" />,
  },
  {
    name: "Real Estate Token",
    description: "Token representing fractional ownership of real estate",
    category: "Real Estate",
    standard: "ERC-1400",
    defaultBlocks: {
      compliance: ["KYC", "AML", "Accredited Investors Only"],
      features: ["Rental Income", "Transfer Restrictions", "Redemption Rights"],
      governance: ["Manager Approval"],
    },
    icon: <Coins className="h-8 w-8 text-green-500" />,
  },
  {
    name: "Bond Token",
    description: "Fixed income security with regular coupon payments",
    category: "Bonds",
    standard: "ERC-20",
    defaultBlocks: {
      compliance: ["KYC", "AML"],
      features: ["Fixed Interest", "Maturity Date", "Early Redemption"],
      governance: ["Issuer Control"],
    },
    icon: <Coins className="h-8 w-8 text-purple-500" />,
  },
  {
    name: "Fund Token",
    description: "Token representing shares in an investment fund",
    category: "Funds, ETFs, ETPs",
    standard: "ERC-4626 + ERC-1400",
    defaultBlocks: {
      compliance: [
        "KYC",
        "AML",
        "Investor Qualification",
        "Whitelist",
        "Jurisdiction Restrictions",
      ],
      features: [
        "NAV Calculation",
        "Redemption Windows",
        "Management Fee",
        "Deposit Limits",
        "Withdrawal Limits",
        "Yield Strategy",
      ],
      governance: ["Fund Manager Control"],
    },
    icon: <Coins className="h-8 w-8 text-amber-500" />,
  },
  {
    name: "Structured Product Token",
    description:
      "Complex financial product with conditional returns and multiple tranches",
    category: "Structured Products",
    standard: "ERC-3525",
    defaultBlocks: {
      compliance: [
        "KYC",
        "AML",
        "Sophisticated Investors Only",
        "Jurisdiction Restrictions",
      ],
      features: [
        "Conditional Returns",
        "Barrier Levels",
        "Underlying Asset Linkage",
        "Tranche Structure",
        "Maturity Date",
      ],
      governance: ["Issuer Control"],
    },
    icon: <Coins className="h-8 w-8 text-red-500" />,
  },
  {
    name: "Credit Linked Note",
    description:
      "Structured product linked to credit performance of underlying assets",
    category: "Structured Products",
    standard: "ERC-3525",
    defaultBlocks: {
      compliance: [
        "KYC",
        "AML",
        "Accredited Investors Only",
        "Jurisdiction Restrictions",
      ],
      features: [
        "Tranche Structure",
        "Interest Rate",
        "Maturity Date",
        "Credit Event Triggers",
      ],
      governance: ["Issuer Control"],
    },
    icon: <Coins className="h-8 w-8 text-orange-500" />,
  },
];

const BUILDING_BLOCKS = {
  compliance: [
    { id: "kyc", name: "KYC", description: "Know Your Customer verification" },
    {
      id: "aml",
      name: "AML",
      description: "Anti-Money Laundering checks",
    },
    {
      id: "accredited",
      name: "Accredited Investors Only",
      description: "Restrict to accredited/qualified investors",
    },
    {
      id: "jurisdiction",
      name: "Jurisdiction Restrictions",
      description: "Restrict based on investor jurisdiction",
    },
    {
      id: "max_investors",
      name: "Maximum Investors",
      description: "Limit the total number of investors",
    },
  ],
  features: [
    {
      id: "voting",
      name: "Voting",
      description: "Enable governance voting rights",
    },
    {
      id: "dividends",
      name: "Dividends",
      description: "Enable dividend/distribution payments",
    },
    {
      id: "transfer_restrictions",
      name: "Transfer Restrictions",
      description: "Restrict token transfers based on rules",
    },
    {
      id: "redemption",
      name: "Redemption Rights",
      description: "Allow token redemption under specific conditions",
    },
    {
      id: "lockup",
      name: "Lockup Period",
      description: "Enforce token lockup periods",
    },
    {
      id: "vesting",
      name: "Vesting Schedule",
      description: "Implement token vesting schedules",
    },
    {
      id: "share_classes",
      name: "Share Classes",
      description: "Support for multiple share classes with different rights",
    },
  ],
  governance: [
    {
      id: "issuer_control",
      name: "Issuer Control",
      description: "Issuer maintains full control over token",
    },
    {
      id: "board_approval",
      name: "Board Approval",
      description: "Require board approval for certain actions",
    },
    {
      id: "dao",
      name: "DAO Governance",
      description: "Decentralized Autonomous Organization governance",
    },
    {
      id: "multi_sig",
      name: "Multi-Signature",
      description: "Require multiple signatures for key actions",
    },
  ],
};

const TokenBuilderEnhanced: React.FC<TokenBuilderProps> = ({
  projectId: propProjectId,
}) => {
  const { projectId: paramProjectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use projectId from props or from URL params
  const currentProjectId = propProjectId || paramProjectId;

  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tokens");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TokenTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");

  // New token form state
  const [tokenForm, setTokenForm] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    standard: "ERC-20",
    totalSupply: 1000000,
    blocks: {
      compliance: [] as string[],
      features: [] as string[],
      governance: [] as string[],
    },
    metadata: {
      description: "",
      category: "",
      product: "",
      issuanceDate: "",
      maturityDate: "",
      tranches: [] as {
        id: number;
        name: string;
        value: number;
        interestRate: number;
      }[],
      shareClasses: [] as ShareClass[],
      whitelistEnabled: true,
      jurisdictionRestrictions: [] as string[],
      conversionRate: 0,
      // Fund & ETF specific fields
      underlyingAsset: "ETH",
      yieldStrategy: "STAKING",
      minDeposit: "1000",
      maxDeposit: "1000000",
      redemptionNoticeDays: "30",
      managementFee: "2.0",
      navOracleEnabled: false,
      erc20ConversionRate: "1.0",
      // Multi-class equity specific fields
      ownerWallet: "",
      kycRequired: true,
      multiClassEnabled: false,
      erc20Conversion: false,
    },
  });

  // Fetch tokens when component mounts
  useEffect(() => {
    if (currentProjectId) {
      fetchTokens();
      fetchProjectDetails();
    }
  }, [currentProjectId]);

  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .eq("id", currentProjectId)
        .single();

      if (error) throw error;
      setProjectName(data.name);
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  // Fetch tokens for the current project
  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("tokens")
        .select("*")
        .eq("project_id", currentProjectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      toast({
        title: "Error",
        description: "Failed to load tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle token selection
  const handleSelectToken = async (token: Token) => {
    setSelectedToken(token);
    setActiveTab("builder");
    setTokenForm({
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      standard: token.standard,
      totalSupply: token.metadata?.totalSupply || 1000000,
      blocks: token.blocks || {
        compliance: [],
        features: [],
        governance: [],
      },
      metadata: token.metadata || {
        description: "",
        category: "",
        product: "",
        shareClasses: [],
        whitelistEnabled: true,
        jurisdictionRestrictions: [],
        ownerWallet: "",
        kycRequired: true,
        multiClassEnabled: false,
        erc20Conversion: false,
      },
    });
  };

  // Handle creating a new token
  const handleCreateToken = () => {
    setSelectedToken(null);
    setIsCreating(true);
    setActiveTab("templates");
    resetTokenForm();
  };

  // Reset token form
  const resetTokenForm = () => {
    setTokenForm({
      name: "",
      symbol: "",
      decimals: 18,
      standard: "ERC-20",
      totalSupply: 1000000,
      blocks: {
        compliance: [],
        features: [],
        governance: [],
      },
      metadata: {
        description: "",
        category: "",
        product: "",
        issuanceDate: "",
        maturityDate: "",
        tranches: [],
        shareClasses: [],
        whitelistEnabled: true,
        jurisdictionRestrictions: [],
        conversionRate: 0,
        underlyingAsset: "ETH",
        yieldStrategy: "STAKING",
        minDeposit: "1000",
        maxDeposit: "1000000",
        redemptionNoticeDays: "30",
        managementFee: "2.0",
        navOracleEnabled: false,
        erc20ConversionRate: "1.0",
        ownerWallet: "",
        kycRequired: true,
        multiClassEnabled: false,
        erc20Conversion: false,
      },
    });
    setSelectedTemplate(null);
    setSelectedCategory("");
    setSelectedProduct("");
  };

  // Handle selecting a template
  const handleSelectTemplate = (template: TokenTemplate) => {
    setSelectedTemplate(template);

    // Default tranches for structured products
    const defaultTranches =
      template.name.includes("Structured Product") ||
      template.name.includes("Credit Linked")
        ? [
            { id: 1, name: "Senior (AAA)", value: 700000, interestRate: 3 },
            { id: 2, name: "Mezzanine (BBB)", value: 200000, interestRate: 5 },
            { id: 3, name: "Junior (CCC)", value: 100000, interestRate: 8 },
          ]
        : [];

    // Default share classes for multi-class equity
    const defaultShareClasses = 
      template.name === "Multi-Class Equity Token"
        ? [
            { 
              id: 1, 
              name: "Class A (Common)", 
              initialSupply: 700000, 
              lockupPeriod: 0, 
              whitelist: [], 
              conversionRatio: 1, 
              votingRights: true, 
              dividendRights: true, 
              transferRestrictions: false 
            },
            { 
              id: 2, 
              name: "Class B (Preferred)", 
              initialSupply: 200000, 
              lockupPeriod: 180, 
              whitelist: [], 
              conversionRatio: 1.5, 
              votingRights: true, 
              dividendRights: true, 
              transferRestrictions: true 
            },
            { 
              id: 3, 
              name: "Class C (Restricted)", 
              initialSupply: 100000, 
              lockupPeriod: 365, 
              whitelist: [], 
              conversionRatio: 0.8, 
              votingRights: false, 
              dividendRights: true, 
              transferRestrictions: true 
            },
          ]
        : [];

    // Default name and symbol for templates
    let defaultName = "";
    let defaultSymbol = "";

    if (template.name === "Credit Linked Note") {
      defaultName = "CreditLinkedNote2025";
      defaultSymbol = "CLN";
    } else if (template.name === "Fund Token") {
      defaultName = "YieldFund2025";
      defaultSymbol = "YF";
    } else if (template.name === "Multi-Class Equity Token") {
      defaultName = "MultiClassEquity2025";
      defaultSymbol = "MCE";
    }

    setTokenForm({
      name: defaultName,
      symbol: defaultSymbol,
      decimals: template.standard === "ERC-3525" ? 0 : 18, // 0 decimals for structured products
      standard: template.standard,
      totalSupply: 1000000,
      blocks: template.defaultBlocks,
      metadata: {
        description: "",
        category: template.category,
        product: template.name,
        issuanceDate: new Date().toISOString().split("T")[0],
        maturityDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 5),
        )
          .toISOString()
          .split("T")[0],
        tranches: defaultTranches,
        shareClasses: defaultShareClasses,
        whitelistEnabled: true,
        jurisdictionRestrictions: [],
        conversionRate: 100,
        underlyingAsset: "ETH",
        yieldStrategy: "STAKING",
        minDeposit: "1000",
        maxDeposit: "1000000",
        redemptionNoticeDays: "30",
        managementFee: "2.0",
        navOracleEnabled: false,
        erc20ConversionRate: "1.0",
        ownerWallet: "",
        kycRequired: true,
        multiClassEnabled: template.name === "Multi-Class Equity Token",
        erc20Conversion: template.name === "Multi-Class Equity Token",
      },
    });
    setActiveTab("builder");
  };

  // Handle selecting a product category
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct("");
  };

  // Handle selecting a product
  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
    // Find matching templates
    const matchingTemplates = TOKEN_TEMPLATES.filter(
      (template) => template.category === product,
    );
    if (matchingTemplates.length === 1) {
      handleSelectTemplate(matchingTemplates[0]);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTokenForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle token standard change
  const handleStandardChange = (value: string) => {
    setTokenForm((prev) => ({ ...prev, standard: value }));
  };

  // Handle building block toggle
  const handleBlockToggle = (
    blockType: "compliance" | "features" | "governance",
    blockId: string,
  ) => {
    setTokenForm((prev) => {
      const blocks = { ...prev.blocks };
      if (blocks[blockType].includes(blockId)) {
        blocks[blockType] = blocks[blockType].filter((id) => id !== blockId);
      } else {
        blocks[blockType] = [...blocks[blockType], blockId];
      }
      return { ...prev, blocks };
    });
  };

  // Handle share classes update
  const handleShareClassesUpdate = (shareClasses: ShareClass[]) => {
    setTokenForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        shareClasses,
      },
    }));
  };

  // Handle ERC-20 conversion toggle
  const handleErc20ConversionChange = (enabled: boolean) => {
    setTokenForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        erc20Conversion: enabled,
      },
    }));
  };

  // Save token to database
  const saveToken = async () => {
    try {
      setIsSaving(true);

      // Validate form
      if (!tokenForm.name || !tokenForm.symbol || !tokenForm.standard) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Generate contract preview (simplified for demo)
      const contractPreview = generateContractPreview();

      if (selectedToken) {
        // Update existing token
        const { error } = await supabase
          .from("tokens")
          .update({
            name: tokenForm.name,
            symbol: tokenForm.symbol,
            decimals: tokenForm.decimals,
            standard: tokenForm.standard,
            blocks: tokenForm.blocks,
            metadata: {
              ...tokenForm.metadata,
              totalSupply: tokenForm.totalSupply,
            },
            contract_preview: contractPreview,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedToken.id);

        if (error) throw error;

        // Create a new version
        await supabase.from("token_versions").insert({
          token_id: selectedToken.id,
          version: 1, // In a real app, you'd increment this
          data: {
            name: tokenForm.name,
            symbol: tokenForm.symbol,
            decimals: tokenForm.decimals,
            standard: tokenForm.standard,
            blocks: tokenForm.blocks,
            metadata: tokenForm.metadata,
            totalSupply: tokenForm.totalSupply,
          },
          created_at: new Date().toISOString(),
        });

        toast({
          title: "Success",
          description: "Token updated successfully.",
        });
      } else {
        // Create new token
        const { data, error } = await supabase
          .from("tokens")
          .insert({
            project_id: currentProjectId,
            name: tokenForm.name,
            symbol: tokenForm.symbol,
            decimals: tokenForm.decimals,
            standard: tokenForm.standard,
            blocks: tokenForm.blocks,
            metadata: {
              ...tokenForm.metadata,
              totalSupply: tokenForm.totalSupply,
            },
            status: "DRAFT",
            contract_preview: contractPreview,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Create initial version
        await supabase.from("token_versions").insert({
          token_id: data.id,
          version: 1,
          data: {
            name: tokenForm.name,
            symbol: tokenForm.symbol,
            decimals: tokenForm.decimals,
            standard: tokenForm.standard,
            blocks: tokenForm.blocks,
            metadata: tokenForm.metadata,
            totalSupply: tokenForm.totalSupply,
          },
          created_at: new Date().toISOString(),
        });

        setSelectedToken(data);
        toast({
          title: "Success",
          description: "Token created successfully.",
        });
      }

      // Refresh tokens list
      fetchTokens();
      setIsCreating(false);
    } catch (err) {
      console.error("Error saving token:", err);
      toast({
        title: "Error",
        description: "Failed to save token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete token
  const deleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from("tokens")
        .delete()
        .eq("id", tokenId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Token deleted successfully.",
      });

      // Refresh tokens list and reset selection
      fetchTokens();
      setSelectedToken(null);
      setActiveTab("tokens");
    } catch (err) {
      console.error("Error deleting token:", err);
      toast({
        title: "Error",
        description: "Failed to delete token. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate contract preview (simplified)
  const generateContractPreview = () => {
    const { name, symbol, standard, blocks, metadata, totalSupply, decimals } =
      tokenForm;
    let preview = "";

    if (standard === "ERC-1400 + ERC-3643") {
      // Multi-class equity token contract preview
      preview = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is Ownable {
    // ERC-1400 + ERC-3643 Security Token Implementation with Multiple Share Classes
    string private _name = "${name}";
    string private _symbol = "${symbol}";
    uint8 private _decimals = ${decimals};
    uint256 private _totalSupply = ${totalSupply};
    
    // Share class structure
    struct ShareClass {
        uint256 id;
        string name;
        uint256 initialSupply;
        uint256 lockupPeriod; // in seconds
        bool votingRights;
        bool dividendRights;
        bool transferRestrictions;
        uint256 conversionRatio; // multiplied by 1000 for precision
    }
    
    // Mapping from share class ID to class details
    mapping(uint256 => ShareClass) private _shareClasses;
    
    // Mapping from address to balance per share class
    mapping(address => mapping(uint256 => uint256)) private _balances;
    
    // Mapping for allowances per share class
    mapping(address => mapping(address => mapping(uint256 => uint256))) private _allowances;
    
    // Whitelist for each share class
    mapping(uint256 => mapping(address => bool)) private _whitelists;
    
    // KYC verification
    mapping(address => bool) private _kycVerified;
    bool private _kycRequired = ${metadata.kycRequired ? "true" : "false"};
    
    // Lockup end times per address and share class
    mapping(address => mapping(uint256 => uint256)) private _lockupEndTimes;
    
    // Events
    event ShareClassCreated(uint256 indexed classId, string name, uint256 initialSupply);
    event Transfer(address indexed from, address indexed to, uint256 classId, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 classId, uint256 value);
    
    constructor() {
        // Initialize share classes
${metadata.shareClasses.map((sc) => `        _createShareClass(${sc.id}, "${sc.name}", ${sc.initialSupply}, ${sc.lockupPeriod * 86400}, ${sc.votingRights}, ${sc.dividendRights}, ${sc.transferRestrictions}, ${sc.conversionRatio * 1000});`).join("\n")}
    }
    
    function _createShareClass(
        uint256 classId, 
        string memory name, 
        uint256 initialSupply, 
        uint256 lockupPeriod,
        bool votingRights,
        bool dividendRights,
        bool transferRestrictions,
        uint256 conversionRatio
    ) internal {
        require(_shareClasses[classId].id == 0, "Share class already exists");
        _shareClasses[classId] = ShareClass(classId, name, initialSupply, lockupPeriod, votingRights, dividendRights, transferRestrictions, conversionRatio);
        _balances[owner()][classId] = initialSupply;
        _totalSupply += initialSupply;
        emit ShareClassCreated(classId, name, initialSupply);
    }
    
    // Get share class details
    function getShareClass(uint256 classId) external view returns (string memory, uint256, uint256, bool, bool, bool, uint256) {
        ShareClass memory sc = _shareClasses[classId];
        require(sc.id != 0, "Share class does not exist");
        return (sc.name, sc.initialSupply, sc.lockupPeriod, sc.votingRights, sc.dividendRights, sc.transferRestrictions, sc.conversionRatio);
    }
    
    // Get balance of an address for a specific share class
    function balanceOf(address account, uint256 classId) external view returns (uint256) {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        return _balances[account][classId];
    }
    
    // Transfer tokens of a specific share class
    function transfer(address to, uint256 classId, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, classId, amount);
        return true;
    }
    
    // Internal transfer function with compliance checks
    function _transfer(address from, address to, uint256 classId, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        require(_balances[from][classId] >= amount, "Insufficient balance");
        
        // Check KYC if required
        if (_kycRequired) {
            require(_kycVerified[from], "Sender not KYC verified");
            require(_kycVerified[to], "Recipient not KYC verified");
        }
        
        // Check whitelist if class has transfer restrictions
        if (_shareClasses[classId].transferRestrictions) {
            require(_whitelists[classId][to], "Recipient not whitelisted for this share class");
        }
        
        // Check lockup period
        if (_lockupEndTimes[from][classId] > 0) {
            require(block.timestamp >= _lockupEndTimes[from][classId], "Tokens are still locked");
        }
        
        _balances[from][classId] -= amount;
        _balances[to][classId] += amount;
        
        // Set lockup end time for recipient if applicable
        if (_shareClasses[classId].lockupPeriod > 0) {
            _lockupEndTimes[to][classId] = block.timestamp + _shareClasses[classId].lockupPeriod;
        }
        
        emit Transfer(from, to, classId, amount);
    }
    
    // Approve spending of tokens from a specific share class
    function approve(address spender, uint256 classId, uint256 amount) external returns (bool) {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        _allowances[msg.sender][spender][classId] = amount;
        emit Approval(msg.sender, spender, classId, amount);
        return true;
    }
    
    // Get allowance for a specific share class
    function allowance(address owner, address spender, uint256 classId) external view returns (uint256) {
        return _allowances[owner][spender][classId];
    }
    
    // Transfer tokens from another address for a specific share class
    function transferFrom(address from, address to, uint256 classId, uint256 amount) external returns (bool) {
        require(_allowances[from][msg.sender][classId] >= amount, "Insufficient allowance");
        _allowances[from][msg.sender][classId] -= amount;
        _transfer(from, to, classId, amount);
        return true;
    }
    
    // Set KYC status for an address
    function setKycStatus(address account, bool status) external onlyOwner {
        _kycVerified[account] = status;
    }
    
    // Set whitelist status for an address in a specific share class
    function setWhitelistStatus(uint256 classId, address account, bool status) external onlyOwner {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        _whitelists[classId][account] = status;
    }
    
    // Mint additional tokens for a specific share class
    function mint(address to, uint256 classId, uint256 amount) external onlyOwner {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        require(to != address(0), "Mint to zero address");
        
        _balances[to][classId] += amount;
        _totalSupply += amount;
        
        emit Transfer(address(0), to, classId, amount);
    }
    
    // Burn tokens from a specific share class
    function burn(uint256 classId, uint256 amount) external {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        require(_balances[msg.sender][classId] >= amount, "Insufficient balance");
        
        _balances[msg.sender][classId] -= amount;
        _totalSupply -= amount;
        
        emit Transfer(msg.sender, address(0), classId, amount);
    }
    
    // Get total supply across all share classes
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
    
    // Get total supply for a specific share class
    function totalSupplyByClass(uint256 classId) external view returns (uint256) {
        require(_shareClasses[classId].id != 0, "Share class does not exist");
        return _shareClasses[classId].initialSupply;
    }
    
    // Check if an address can vote (must hold tokens with voting rights)
    function canVote(address account) external view returns (bool) {
        for (uint256 i = 1; i <= ${metadata.shareClasses.length}; i++) {
            if (_shareClasses[i].votingRights && _balances[account][i] > 0) {
                return true;
            }
        }
        return false;
    }
    
    // Get voting power of an address (sum of all tokens with voting rights)
    function votingPower(address account) external view returns (uint256) {
        uint256 power = 0;
        for (uint256 i = 1; i <= ${metadata.shareClasses.length}; i++) {
            if (_shareClasses[i].votingRights) {
                power += _balances[account][i];
            }
        }
        return power;
    }
    
    // Distribute dividends to holders of tokens with dividend rights
    function distributeDividends(uint256 totalAmount) external payable onlyOwner {
        require(totalAmount > 0, "Amount must be greater than 0");
        
        // Calculate total dividend-eligible tokens
        uint256 totalEligibleTokens = 0;
        for (uint256 i = 1; i <= ${metadata.shareClasses.length}; i++) {
            if (_shareClasses[i].dividendRights) {
                totalEligibleTokens += _shareClasses[i].initialSupply;
            }
        }
        
        require(totalEligibleTokens > 0, "No dividend-eligible tokens");
        
        // Implementation would distribute dividends proportionally
        // This is a simplified version for preview purposes
    }
}`;
    } else if (standard === "ERC-20") {
      preview = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is ERC20, Ownable {
    constructor() ERC20("${name}", "${symbol}") {
        // Initial setup
        _mint(msg.sender, ${totalSupply} * 10**${decimals});
    }
`;

      // Add compliance features
      if (blocks.compliance.includes("KYC")) {
        preview += `
    // KYC Implementation
    mapping(address => bool) private _kycApproved;
    
    function setKycStatus(address account, bool status) external onlyOwner {
        _kycApproved[account] = status;
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        require(from == address(0) || _kycApproved[from], "KYC not approved for sender");
        require(to == address(0) || _kycApproved[to], "KYC not approved for recipient");
    }
`;
      }

      // Add features
      if (blocks.features.includes("Dividends")) {
        preview += `
    // Dividend Distribution
    function distributeTokenDividends(uint256 amount) external onlyOwner {
        // Dividend distribution logic
    }
`;
      }

      preview += "}"; // Close contract
    } else if (standard === "ERC-1400") {
      preview = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is ERC20, Ownable {
    // ERC-1400 Security Token Implementation
    constructor() ERC20("${name}", "${symbol}") {
        // Initial setup
        _mint(msg.sender, ${totalSupply} * 10**${decimals});
    }
`;

      // Add compliance features
      if (blocks.compliance.length > 0) {
        preview += `
    // Compliance Controls
    mapping(address => bool) private _whitelisted;
    ${metadata.whitelistEnabled ? "bool private _whitelistEnabled = true;" : "bool private _whitelistEnabled = false;"}
    
    function setWhitelistStatus(address account, bool status) external onlyOwner {
        _whitelisted[account] = status;
    }
    
    function setWhitelistEnabled(bool enabled) external onlyOwner {
        _whitelistEnabled = enabled;
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        if (_whitelistEnabled) {
            require(from == address(0) || _whitelisted[from], "Sender not whitelisted");
            require(to == address(0) || _whitelisted[to], "Recipient not whitelisted");
        }
    }
`;
      }

      // Add jurisdiction restrictions if any
      if (
        metadata.jurisdictionRestrictions &&
        metadata.jurisdictionRestrictions.length > 0
      ) {
        preview += `
    // Jurisdiction Restrictions
    mapping(string => bool) private _restrictedJurisdictions;
    
    constructor() {
        ${metadata.jurisdictionRestrictions.map((j) => `_restrictedJurisdictions["${j}"] = true;`).join("\n        ")}
    }
    
    function setJurisdictionRestriction(string memory jurisdiction, bool restricted) external onlyOwner {
        _restrictedJurisdictions[jurisdiction] = restricted;
    }
    
    function isJurisdictionRestricted(string memory jurisdiction) public view returns (bool) {
        return _restrictedJurisdictions[jurisdiction];
    }
`;
      }

      preview += "}"; // Close contract
    } else if (standard === "ERC-3525") {
      preview = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is ERC721Enumerable, Ownable {
    // ERC-3525 Semi-Fungible Token Implementation for Structured Products
    
    // Token details
    string private _name = "${name}";
    string private _symbol = "${symbol}";
    uint8 private _decimals = ${decimals};
    uint256 private _totalSupply = ${totalSupply};
    
    // Tranche/Slot structure
    struct Tranche {
        uint256 slotId;
        string name;
        uint256 value;
        uint256 interestRate; // Basis points (1% = 100)
    }
    
    // Mapping from slot ID to tranche details
    mapping(uint256 => Tranche) private _tranches;
    
    // Mapping from token ID to slot ID
    mapping(uint256 => uint256) private _tokenSlots;
    
    // Mapping from token ID to value
    mapping(uint256 => uint256) private _tokenValues;
    
    // Issuance and maturity dates
    uint256 private _issuanceDate = ${metadata.issuanceDate ? `${new Date(metadata.issuanceDate).getTime() / 1000}` : "block.timestamp"};
    uint256 private _maturityDate = ${metadata.maturityDate ? `${new Date(metadata.maturityDate).getTime() / 1000}` : "block.timestamp + 157680000"}; // Default: 5 years
    
    // Conversion rate to ERC-20
    uint256 private _conversionRate = ${metadata.conversionRate || 100};
    
    // Events
    event SlotCreated(uint256 indexed slotId, string name, uint256 value, uint256 interestRate);
    event TokenMinted(address indexed to, uint256 indexed tokenId, uint256 indexed slotId, uint256 value);
    
    constructor() ERC721("${name}", "${symbol}") {
        // Initialize tranches
${metadata.tranches.map((tranche) => `        _createTranche(${tranche.id}, "${tranche.name}", ${tranche.value}, ${tranche.interestRate * 100});`).join("\n")}
    }
    
    function _createTranche(uint256 slotId, string memory name, uint256 value, uint256 interestRate) internal {
        require(_tranches[slotId].slotId == 0, "Tranche already exists");
        _tranches[slotId] = Tranche(slotId, name, value, interestRate);
        emit SlotCreated(slotId, name, value, interestRate);
    }
    
    function mintToken(address to, uint256 slotId, uint256 value) external onlyOwner {
        require(_tranches[slotId].slotId != 0, "Tranche does not exist");
        require(value > 0, "Value must be greater than 0");
        
        uint256 tokenId = totalSupply() + 1;
        _mint(to, tokenId);
        _tokenSlots[tokenId] = slotId;
        _tokenValues[tokenId] = value;
        
        emit TokenMinted(to, tokenId, slotId, value);
    }
    
    function getTokenSlot(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenSlots[tokenId];
    }
    
    function getTokenValue(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenValues[tokenId];
    }
    
    function getTrancheDetails(uint256 slotId) external view returns (string memory, uint256, uint256) {
        require(_tranches[slotId].slotId != 0, "Tranche does not exist");
        Tranche memory tranche = _tranches[slotId];
        return (tranche.name, tranche.value, tranche.interestRate);
    }
    
    function getMaturityDate() external view returns (uint256) {
        return _maturityDate;
    }
    
    function getIssuanceDate() external view returns (uint256) {
        return _issuanceDate;
    }
    
    function getConversionRate() external view returns (uint256) {
        return _conversionRate;
    }
`;

      // Add compliance features
      if (blocks.compliance.length > 0) {
        preview += `
    // Compliance Controls
    mapping(address => bool) private _whitelisted;
    ${metadata.whitelistEnabled ? "bool private _whitelistEnabled = true;" : "bool private _whitelistEnabled = false;"}
    
    function setWhitelistStatus(address account, bool status) external onlyOwner {
        _whitelisted[account] = status;
    }
    
    function setWhitelistEnabled(bool enabled) external onlyOwner {
        _whitelistEnabled = enabled;
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        if (_whitelistEnabled) {
            require(from == address(0) || _whitelisted[from], "Sender not whitelisted");
            require(to == address(0) || _whitelisted[to], "Recipient not whitelisted");
        }
    }
`;
      }

      preview += "}"; // Close contract
    }

    return preview;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/projects/${currentProjectId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Token Builder</h1>
          </div>
          <p className="text-muted-foreground">
            Design and structure tokenized assets for {projectName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => fetchTokens()}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleCreateToken}
          >
            <Plus className="h-4 w-4" />
            <span>New Token</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            <span>My Tokens</span>
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="flex items-center gap-2"
            disabled={!isCreating && !selectedToken}
          >
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger
            value="builder"
            className="flex items-center gap-2"
            disabled={!isCreating && !selectedToken}
          >
            <Code className="h-4 w-4" />
            <span>Token Builder</span>
          </TabsTrigger>
        </TabsList>

        {/* Tokens List Tab */}
        <TabsContent value="tokens" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tokens.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Coins className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Tokens Yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You haven't created any tokens for this project. Get started
                  by creating your first token.
                </p>
                <Button onClick={handleCreateToken}>
                  <Plus className="h-4 w-4 mr-2" /> Create Token
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <Card
                  key={token.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectToken(token)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <CardDescription>{token.symbol}</CardDescription>
                      </div>
                      <div>
                        <Badge
                          variant={
                            token.status === "DRAFT" ? "outline" : "default"
                          }
                        >
                          {token.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Standard
                          </p>
                          <p className="font-medium">{token.standard}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Decimals
                          </p>
                          <p className="font-medium">{token.decimals}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Building Blocks
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {token.blocks?.compliance?.map((block: string) => (
                            <Badge key={block} variant="secondary">
                              {block}
                            </Badge>
                          ))}
                          {token.blocks?.features
                            ?.slice(0, 2)
                            .map((block: string) => (
                              <Badge key={block} variant="secondary">
                                {block}
                              </Badge>
                            ))}
                          {(token.blocks?.features?.length > 2 ||
                            token.blocks?.governance?.length > 0) && (
                            <Badge variant="secondary">+more</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(token.created_at).toLocaleDateString()}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Token</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this token? This
                                action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteToken(token.id);
                                }}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Product Category</CardTitle>
              <CardDescription>
                Choose a financial product category to see relevant templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRODUCT_CATEGORIES.map((category) => (
                  <Card
                    key={category.name}
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedCategory === category.name ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleSelectCategory(category.name)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {category.products.map((product) => (
                          <li key={product}>{product}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Select Product Type</CardTitle>
                <CardDescription>
                  Choose a specific product type within {selectedCategory}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PRODUCT_CATEGORIES.find(
                    (cat) => cat.name === selectedCategory,
                  )?.products.map((product) => (
                    <Button
                      key={product}
                      variant={
                        selectedProduct === product ? "default" : "outline"
                      }
                      className="h-auto py-3 justify-start"
                      onClick={() => handleSelectProduct(product)}
                    >
                      {product}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Select Template</CardTitle>
                <CardDescription>
                  Choose a template for your {selectedProduct} token
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TOKEN_TEMPLATES.filter(
                    (template) => template.category === selectedProduct,
                  ).map((template) => (
                    <Card
                      key={template.name}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                          {template.icon}
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Recommended Standard
                            </p>
                            <p className="font-medium">{template.standard}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Default Building Blocks
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {template.defaultBlocks.compliance
                                .slice(0, 2)
                                .map((block: string) => (
                                  <Badge key={block} variant="secondary">
                                    {block}
                                  </Badge>
                                ))}
                              {template.defaultBlocks.features
                                .slice(0, 2)
                                .map((block: string) => (
                                  <Badge key={block} variant="secondary">
                                    {block}
                                  </Badge>
                                ))}
                              {template.defaultBlocks.compliance.length +
                                template.defaultBlocks.features.length +
                                template.defaultBlocks.governance.length >
                                4 && <Badge variant="secondary">+more</Badge>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Custom Template Option */}
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setTokenForm((prev) => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          category: selectedCategory,
                          product: selectedProduct,
                        },
                      }));
                      setActiveTab("builder");
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          Custom Template
                        </CardTitle>
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <CardDescription>
                        Create a custom token from scratch
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Choose your own configuration
                          </p>
                          <p className="font-medium">Full customization</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Select your own building blocks
                          </p>
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setActiveTab("builder")}
                          >
                            Start Building
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedToken ? "Edit Token" : "Create New Token"}
              </CardTitle>
              <CardDescription>
                {selectedToken
                  ? `Editing ${selectedToken.name} (${selectedToken.symbol})`
                  : "Configure your token properties"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Token Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="standard">Token Standard</Label>
                    <Select
                      value={tokenForm.standard}
                      onValueChange={handleStandardChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOKEN_STANDARDS.map((standard) => (
                          <SelectItem
                            key={standard.value}
                            value={standard.value}
                          >
                            {standard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {tokenForm.standard && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {
                          TOKEN_STANDARDS.find(
                            (s) => s.value === tokenForm.standard,
                          )?.description
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Token Configuration for all standards */}
                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-medium">
                    Basic Token Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Token Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., MyToken"
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
                      <Label htmlFor="decimals">Decimals</Label>
                      <Input
                        id="decimals"
                        name="decimals"
                        type="number"
                        min="0"
                        max="18"
                        placeholder="18"
                        value={tokenForm.decimals}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalSupply">Total Supply</Label>
                      <Input
                        id="totalSupply"
                        name="totalSupply"
                        type="number"
                        min="1"
                        placeholder="1000000"
                        value={tokenForm.totalSupply}
                        onChange={(e) =>
                          setTokenForm((prev) => ({
                            ...prev,
                            totalSupply: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* ERC-1400 + ERC-3643 Configuration */}
                {tokenForm.standard === "ERC-1400 + ERC-3643" && (
                  <div className="space-y-6 border-t pt-6">
                    <h3 className="text-lg font-medium">
                      Multi-Class Equity Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ownerWallet">Owner Wallet Address*</Label>
                        <Input
                          id="ownerWallet"
                          placeholder="0x..."
                          value={tokenForm.metadata.ownerWallet || ""}
                          onChange={(e) =>
                            setTokenForm((prev) => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                ownerWallet: e.target.value,
                              },
                            }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Address that will receive all initial tokens
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="kycRequired"
                          checked={tokenForm.metadata.kycRequired !== false}
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
                            Require KYC verification for all token holders
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Share Classes Configuration */}
                    <MultiClassEquityConfig
                      shareClasses={tokenForm.metadata.shareClasses}
                      totalSupply={token