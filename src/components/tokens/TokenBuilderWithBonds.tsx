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
import { Token, TokenTemplate } from "./types";
import BondsConfig from "./BondsConfig";
import BondsTemplate from "./templates/BondsTemplate";

interface TokenBuilderProps {
  projectId?: string;
}

const TOKEN_STANDARDS = [
  {
    value: "ERC-20",
    label: "ERC-20 (Fungible Token)",
    description:
      "Standard for fungible tokens where each token is identical and interchangeable",
  },
  {
    value: "ERC-721",
    label: "ERC-721 (Non-Fungible Token)",
    description:
      "Standard for non-fungible tokens where each token is unique and not interchangeable",
  },
  {
    value: "ERC-1155",
    label: "ERC-1155 (Multi Token)",
    description:
      "Standard for contracts that manage multiple token types (both fungible and non-fungible)",
  },
  {
    value: "ERC-1400",
    label: "ERC-1400 (Security Token)",
    description:
      "Standard for security tokens with transfer restrictions and compliance controls",
  },
  {
    value: "ERC-1400 + ERC-3643",
    label: "ERC-1400 + ERC-3643 (Enhanced Security Token)",
    description:
      "Extended security token standard with advanced compliance features and multiple share classes",
  },
  {
    value: "ERC-3525",
    label: "ERC-3525 (Semi-Fungible Token)",
    description:
      "Standard for semi-fungible tokens with slot-based value system",
  },
  {
    value: "ERC-3525 + ERC-1400",
    label: "ERC-3525 + ERC-1400 (Enhanced Bond Token)",
    description:
      "Comprehensive token standard for bonds with tranches, maturity dates, and compliance features",
  },
  {
    value: "ERC-4626",
    label: "ERC-4626 (Tokenized Vault)",
    description: "Standard for tokenized yield-bearing vaults",
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
  BondsTemplate,
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
];

const TokenBuilderWithBonds: React.FC<TokenBuilderProps> = ({
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
      bondTranches: [] as {
        id: number;
        name: string;
        principalAmount: number;
        interestRate: number;
        maturityDate: string;
        isFixedRate: boolean;
        redemptionPenalty: number;
        minInvestment: number;
      }[],
      shareClasses: [] as {
        id: number;
        name: string;
        initialSupply: number;
        lockupPeriod: number;
        whitelist: string[];
        conversionRatio: number;
        votingRights: boolean;
        dividendRights: boolean;
        transferRestrictions: boolean;
      }[],
      whitelistEnabled: true,
      jurisdictionRestrictions: [] as string[],
      conversionRate: 0,
      // Bond specific fields
      issuerWallet: "",
      callableAfter: 730, // 2 years
      puttableAfter: 1095, // 3 years
      erc20ConversionRatio: 5,
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
        bondTranches: [],
        shareClasses: [],
        whitelistEnabled: true,
        jurisdictionRestrictions: [],
        issuerWallet: "",
        callableAfter: 730,
        puttableAfter: 1095,
        erc20ConversionRatio: 5,
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
        bondTranches: [],
        shareClasses: [],
        whitelistEnabled: true,
        jurisdictionRestrictions: [],
        conversionRate: 0,
        issuerWallet: "",
        callableAfter: 730,
        puttableAfter: 1095,
        erc20ConversionRatio: 5,
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

    // Default name and symbol for templates
    let defaultName = "";
    let defaultSymbol = "";

    if (template.name === "Enhanced Bond Token") {
      defaultName = "Bond5Year";
      defaultSymbol = "B5Y";
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
      decimals: template.standard.includes("ERC-3525") ? 0 : 18,
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
        tranches: [],
        bondTranches: template.defaultMetadata?.bondTranches || [],
        shareClasses: template.defaultMetadata?.shareClasses || [],
        whitelistEnabled: template.defaultMetadata?.whitelistEnabled || true,
        jurisdictionRestrictions: template.defaultMetadata?.jurisdictionRestrictions || [],
        conversionRate: 100,
        issuerWallet: template.defaultMetadata?.issuerWallet || "",
        callableAfter: template.defaultMetadata?.callableAfter || 730,
        puttableAfter: template.defaultMetadata?.puttableAfter || 1095,
        erc20ConversionRatio: template.defaultMetadata?.erc20ConversionRatio || 5,
        ownerWallet: template.defaultMetadata?.ownerWallet || "",
        kycRequired: template.defaultMetadata?.kycRequired !== undefined ? template.defaultMetadata.kycRequired : true,
        multiClassEnabled: template.defaultMetadata?.multiClassEnabled || false,
        erc20Conversion: template.defaultMetadata?.erc20Conversion || false,
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

  // Handle bond field changes
  const handleBondFieldChange = (field: string, value: any) => {
    setTokenForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
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

    if (standard === "ERC-3525 + ERC-1400") {
      // Bond token contract preview
      preview = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, "")} is Ownable {
    // Enhanced Bond Token Implementation with Multiple Tranches
    string private _name = "${name}";
    string private _symbol = "${symbol}";
    uint8 private _decimals = ${decimals};
    uint256 private _totalSupply = ${totalSupply};
    
    // Bond tranche structure
    struct BondTranche {
        uint256 id;
        string name;
        uint256 principalAmount;
        uint256 interestRate; // Basis points (1% = 100)
        uint256 maturityDate; // Timestamp
        bool isFixedRate;
        uint256 redemptionPenalty; // Basis points
        uint256 minInvestment;
    }
    
    // Mapping from tranche ID to tranche details
    mapping(uint256 => BondTranche) private _tranches;
    
    // Mapping from address to balance per tranche
    mapping(address => mapping(uint256 => uint256)) private _balances;
    
    // Mapping for allowances per tranche
    mapping(address => mapping(address => mapping(uint256 => uint256))) private _allowances;
    
    // Whitelist for bondholders
    mapping(address => bool) private _whitelisted;
    bool private _whitelistEnabled = ${metadata.whitelistEnabled ? "true" : "false"};
    
    // KYC verification
    mapping(address => bool) private _kycVerified;
    bool private _kycRequired = ${metadata.kycRequired ? "true" : "false"};
    
    // Bond redemption options
    uint256 private _callableAfter = ${metadata.callableAfter || 730} * 1 days; // Days after issuance
    uint256 private _puttableAfter = ${metadata.puttableAfter || 1095} * 1 days; // Days after issuance
    uint256 private _issuanceDate;
    
    // ERC-20 conversion
    uint256 private _erc20ConversionRatio = ${metadata.erc20ConversionRatio || 5};
    
    // Events
    event TrancheCreated(uint256 indexed trancheId, string name, uint256 principalAmount, uint256 interestRate, uint256 maturityDate);
    event Transfer(address indexed from, address indexed to, uint256 trancheId, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 trancheId, uint256 value);
    event InterestPaid(uint256 trancheId, uint256 amount, uint256 date);
    event BondRedeemed(address indexed bondholder, uint256 trancheId, uint256 amount, uint256 date);
    
    constructor() {
        // Set issuance date
        _issuanceDate = block.timestamp;
        
        // Initialize tranches
${metadata.bondTranches?.map((t) => `        _createTranche(${t.id}, "${t.name}", ${t.principalAmount}, ${t.interestRate * 100}, ${new Date(t.maturityDate).getTime() / 1000}, ${t.isFixedRate}, ${t.redemptionPenalty * 100}, ${t.minInvestment});`).join("\n") || ""}
    }
    
    function _createTranche(
        uint256 trancheId, 
        string memory name, 
        uint256 principalAmount, 
        uint256 interestRate,
        uint256 maturityDate,
        bool isFixedRate,
        uint256 redemptionPenalty,
        uint256 minInvestment
    ) internal {
        require(_tranches[trancheId].id == 0, "Tranche already exists");
        _tranches[trancheId] = BondTranche(trancheId, name, principalAmount, interestRate, maturityDate, isFixedRate, redemptionPenalty, minInvestment);
        _balances[owner()][trancheId] = principalAmount;
        _totalSupply += principalAmount;
        emit TrancheCreated(trancheId, name, principalAmount, interestRate, maturityDate);
    }
    
    // Get tranche details
    function getTranche(uint256 trancheId) external view returns (string memory, uint256, uint256, uint256, bool, uint256, uint256) {
        BondTranche memory t = _tranches[trancheId];
        require(t.id != 0, "Tranche does not exist");
        return (t.name, t.principalAmount, t.interestRate, t.maturityDate, t.isFixedRate, t.redemptionPenalty, t.minInvestment);
    }
    
    // Get balance of an address for a specific tranche
    function balanceOf(address account, uint256 trancheId) external view returns (uint256) {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        return _balances[account][trancheId];
    }
    
    // Transfer bonds of a specific tranche
    function transfer(address to, uint256 trancheId, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, trancheId, amount);
        return true;
    }
    
    // Internal transfer function with compliance checks
    function _transfer(address from, address to, uint256 trancheId, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        require(_balances[from][trancheId] >= amount, "Insufficient balance");
        
        // Check KYC if required
        if (_kycRequired) {
            require(_kycVerified[from], "Sender not KYC verified");
            require(_kycVerified[to], "Recipient not KYC verified");
        }
        
        // Check whitelist if enabled
        if (_whitelistEnabled) {
            require(_whitelisted[to], "Recipient not whitelisted");
        }
        
        // Check minimum investment
        if (_balances[to][trancheId] == 0) {
            require(amount >= _tranches[trancheId].minInvestment, "Amount below minimum investment");
        }
        
        _balances[from][trancheId] -= amount;
        _balances[to][trancheId] += amount;
        
        emit Transfer(from, to, trancheId, amount);
    }
    
    // Approve spending of bonds from a specific tranche
    function approve(address spender, uint256 trancheId, uint256 amount) external returns (bool) {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        _allowances[msg.sender][spender][trancheId] = amount;
        emit Approval(msg.sender, spender, trancheId, amount);
        return true;
    }
    
    // Get allowance for a specific tranche
    function allowance(address owner, address spender, uint256 trancheId) external view returns (uint256) {
        return _allowances[owner][spender][trancheId];
    }
    
    // Transfer bonds from another address for a specific tranche
    function transferFrom(address from, address to, uint256 trancheId, uint256 amount) external returns (bool) {
        require(_allowances[from][msg.sender][trancheId] >= amount, "Insufficient allowance");
        _allowances[from][msg.sender][trancheId] -= amount;
        _transfer(from, to, trancheId, amount);
        return true;
    }
    
    // Set KYC status for an address
    function setKycStatus(address account, bool status) external onlyOwner {
        _kycVerified[account] = status;
    }
    
    // Set whitelist status for an address
    function setWhitelistStatus(address account, bool status) external onlyOwner {
        _whitelisted[account] = status;
    }
    
    // Pay interest for a specific tranche
    function payInterest(uint256 trancheId) external payable onlyOwner {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        require(msg.value > 0, "Amount must be greater than 0");
        
        // In a real implementation, this would distribute interest to bondholders
        // based on their holdings in this tranche
        emit InterestPaid(trancheId, msg.value, block.timestamp);
    }
    
    // Redeem bonds at maturity
    function redeemBonds(uint256 trancheId, uint256 amount) external {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        require(_balances[msg.sender][trancheId] >= amount, "Insufficient balance");
        
        BondTranche memory tranche = _tranches[trancheId];
        
        // Check if bonds are mature
        bool isMature = block.timestamp >= tranche.maturityDate;
        
        // Check if bonds are callable by issuer
        bool isCallable = block.timestamp >= _issuanceDate + _callableAfter;
        
        // Check if bonds are puttable by bondholder
        bool isPuttable = block.timestamp >= _issuanceDate + _puttableAfter;
        
        // Bonds can be redeemed if they are mature, callable by issuer, or puttable by bondholder
        require(isMature || (msg.sender == owner() && isCallable) || isPuttable, "Bonds cannot be redeemed yet");
        
        // Apply early redemption penalty if applicable
        uint256 redemptionAmount = amount;
        if (!isMature && isPuttable) {
            uint256 penalty = (amount * tranche.redemptionPenalty) / 10000; // Convert basis points to percentage
            redemptionAmount -= penalty;
        }
        
        // Burn the bonds
        _balances[msg.sender][trancheId] -= amount;
        _totalSupply -= amount;
        
        // In a real implementation, this would transfer the principal back to the bondholder
        emit BondRedeemed(msg.sender, trancheId, redemptionAmount, block.timestamp);
    }
    
    // Convert to ERC-20 tokens for secondary market liquidity
    function convertToERC20(uint256 trancheId, uint256 amount) external returns (uint256) {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        require(_balances[msg.sender][trancheId] >= amount, "Insufficient balance");
        
        // Burn bond tokens
        _balances[msg.sender][trancheId] -= amount;
        
        // Calculate ERC-20 tokens to mint
        uint256 erc20Amount = amount * _erc20ConversionRatio;
        
        // In a real implementation, this would mint ERC-20 tokens to the user
        // For this preview, we just return the amount
        return erc20Amount;
    }
    
    // Get total supply across all tranches
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
    
    // Get total supply for a specific tranche
    function totalSupplyByTranche(uint256 trancheId) external view returns (uint256) {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        return _tranches[trancheId].principalAmount;
    }
    
    // Get bond redemption options
    function getRedemptionOptions() external view returns (uint256, uint256, uint256) {
        return (_issuanceDate, _callableAfter, _puttableAfter);
    }
    
    // Calculate accrued interest for a bondholder
    function calculateAccruedInterest(address bondholder, uint256 trancheId) external view returns (uint256) {
        require(_tranches[trancheId].id != 0, "Tranche does not exist");
        
        BondTranche memory tranche = _tranches[trancheId];
        uint256 balance = _balances[bondholder][trancheId];
        
        if (balance == 0) return 0;
        
        // Calculate time elapsed since issuance in years (simplified)
        uint256 timeElapsed = block.timestamp - _issuanceDate;
        uint256 yearsElapsed = timeElapsed / (365 days);
        
        // Calculate accrued interest (principal * rate * time)
        uint256 interest = (balance * tranche.interestRate * yearsElapsed) / 10000; // Convert basis points to percentage
        
        return interest;
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
      if (blocks.features.includes("Fixed Interest")) {
        preview += `
    // Interest Payment
    uint256 private _interestRate = 5; // 5% annual interest rate
    uint256 private _lastInterestPaymentTime;
    
    function payInterest() external onlyOwner {
        uint256 timeSinceLastPayment = block.timestamp - _lastInterestPaymentTime;
        uint256 yearFraction = timeSinceLastPayment / (365 days);
        uint256 interestAmount = (totalSupply() * _interestRate * yearFraction) / 100;
        
        // In a real implementation, this would distribute interest to token holders
        _lastInterestPaymentTime = block.timestamp;
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
    } else if (standard === "ERC-1400 + ERC-3643") {
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
${metadata.shareClasses?.map((sc) => `        _createShareClass(${sc.id}, "${sc.name}", ${sc.initialSupply}, ${sc.lockupPeriod * 86400}, ${sc.votingRights}, ${sc.dividendRights}, ${sc.transferRestrictions}, ${sc.conversionRatio * 1000});`).join("\n") || ""}
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
        for (uint256 i = 1; i <= ${metadata.shareClasses?.length || 0}; i++) {
            if (_shareClasses[i].votingRights && _balances[account][i] > 0) {
                return true;
            }
        }
        return false;
    }
    
    // Get voting power of an address (sum of all tokens with voting rights)
    function votingPower(address account) external view returns (uint256) {
        uint256 power = 0;
        for (uint256 i = 1; i <= ${metadata.shareClasses?.length || 0}; i++) {
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
        for (uint256 i = 1; i <= ${metadata.shareClasses?.length || 0}; i++) {
            if (_shareClasses[i].dividendRights) {
                totalEligibleTokens += _shareClasses[i].initialSupply;
            }
        }
        
        require(totalEligibleTokens > 0, "No dividend-eligible tokens");
        
        // Implementation would distribute dividends proportionally
        // This is a simplified version for preview purposes
    }
}`;
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
              <div className="grid grid-cols-1