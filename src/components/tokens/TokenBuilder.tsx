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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Copy,
  Code,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import {
  ERC20Config,
  ERC721Config,
  ERC1155Config,
  ERC1400Config,
  ERC3525Config,
  ERC4626Config,
} from "./standards";

import TokenTemplateBuilder from "./TokenTemplateBuilder";

import {
  TOKEN_STANDARDS,
  PRODUCT_CATEGORIES,
  BUILDING_BLOCKS,
} from "./templates";
import {
  TokenTemplate,
  Token,
  TokenFormState,
  getDefaultTokenForm,
} from "./templates/tokenTemplate";
import { generateContractPreview } from "./templates/contractPreview";

interface TokenBuilderProps {
  projectId?: string;
}

const TOKEN_TEMPLATES: TokenTemplate[] = [];

const TokenBuilder: React.FC<TokenBuilderProps> = ({
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
  // States for product category and product selection
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");

  // New token form state
  const [tokenForm, setTokenForm] = useState<TokenFormState>(
    getDefaultTokenForm(),
  );

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
      blocks: token.blocks || {
        compliance: [],
        features: [],
        governance: [],
      },
      metadata: token.metadata || {
        description: "",
        category: "",
        product: "",
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
    setTokenForm(getDefaultTokenForm());
    setSelectedTemplate(null);
    setSelectedCategory("");
    setSelectedProduct("");
  };

  // Handle selecting a template - simplified since we removed templates
  const handleSelectTemplate = (template: TokenTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("builder");
  };

  // Handle category and product selection
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct("");
  };

  // Handle selecting a product - simplified to go directly to builder
  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
    setTokenForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        category: selectedCategory,
        product: product,
      },
    }));
    setActiveTab("builder");
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

      // Generate contract preview
      const contractPreview = getContractPreview();

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
            metadata: tokenForm.metadata,
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
            metadata: tokenForm.metadata,
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

  // Generate contract preview using the imported function
  const getContractPreview = () => {
    return generateContractPreview(tokenForm);
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
          <TokenTemplateBuilder
            tokenForm={tokenForm}
            handleInputChange={handleInputChange}
            setTokenForm={setTokenForm}
            onSave={() => {
              setActiveTab("builder");
            }}
          />
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

                {/* ERC-20 Configuration */}
                {tokenForm.standard === "ERC-20" && (
                  <ERC20Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* ERC-721 Configuration */}
                {tokenForm.standard === "ERC-721" && (
                  <ERC721Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* ERC-1155 Configuration */}
                {tokenForm.standard === "ERC-1155" && (
                  <ERC1155Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* ERC-1400 Configuration */}
                {tokenForm.standard === "ERC-1400" && (
                  <ERC1400Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* ERC-3525 Configuration */}
                {tokenForm.standard === "ERC-3525" && (
                  <ERC3525Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* ERC-4626 Configuration */}
                {tokenForm.standard === "ERC-4626" && (
                  <ERC4626Config
                    tokenForm={tokenForm}
                    handleInputChange={handleInputChange}
                    setTokenForm={setTokenForm}
                  />
                )}

                {/* Save Button */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("tokens")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveToken}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Token</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenBuilder;
