import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface BulkInvestorUploadProps {
  onUploadComplete?: (investors: any[]) => void;
  onCancel?: () => void;
}

const BulkInvestorUpload = ({
  onUploadComplete = () => {},
  onCancel = () => {},
}: BulkInvestorUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        validateCsvFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        validateCsvFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  // Validate CSV file using PapaParse
  const validateCsvFile = (file: File) => {
    Papa.parse(file, {
      header: hasHeaders,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const errors: any[] = [];
          const data = results.data as Record<string, string>[];

          // Check if file is empty
          if (data.length === 0) {
            setValidationErrors([
              {
                row: 0,
                message: "CSV file is empty or contains only headers",
              },
            ]);
            return;
          }

          // Get headers from the first row or from results.meta
          const headers = hasHeaders
            ? Object.keys(data[0])
            : [
                "name",
                "email",
                "company",
                "type",
                "kyc_status",
                "wallet_address",
              ];

          // Required headers check
          const requiredHeaders = ["name", "email"];
          const missingHeaders = requiredHeaders.filter(
            (h) =>
              !headers.some(
                (header) => header.toLowerCase() === h.toLowerCase(),
              ),
          );

          if (missingHeaders.length > 0) {
            setValidationErrors([
              {
                row: 0,
                message: `Missing required headers: ${missingHeaders.join(", ")}`,
              },
            ]);
            return;
          }

          // Validate each row
          data.forEach((row, index) => {
            // Validate required fields
            if (!row.name) {
              errors.push({
                row: index + 1,
                message: `Row ${index + 1}: Missing required field 'name'`,
              });
            }

            if (!row.email) {
              errors.push({
                row: index + 1,
                message: `Row ${index + 1}: Missing required field 'email'`,
              });
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
              errors.push({
                row: index + 1,
                message: `Row ${index + 1}: Invalid email format '${row.email}'`,
              });
            }

            // Check for wallet address format if provided
            if (
              row.wallet_address &&
              !/^0x[a-fA-F0-9]{40}$/.test(row.wallet_address)
            ) {
              errors.push({
                row: index + 1,
                message: `Row ${index + 1}: Invalid wallet address format '${row.wallet_address}'`,
              });
            }
          });

          // Check for duplicate emails
          const emails = data.map((row) => row.email?.toLowerCase());
          const uniqueEmails = new Set<string>();
          const duplicateEmails = emails.filter((email) => {
            if (!email) return false;
            if (uniqueEmails.has(email)) return true;
            uniqueEmails.add(email);
            return false;
          });

          if (duplicateEmails.length > 0) {
            duplicateEmails.forEach((email) => {
              if (!email) return;
              const indices = emails
                .map((e, i) => (e === email ? i + 1 : -1))
                .filter((i) => i !== -1);

              errors.push({
                row: indices.join(", "),
                message: `Duplicate email '${email}' found in rows ${indices.join(", ")}`,
              });
            });
          }

          setValidationErrors(errors);
          setParsedData(data);
        } catch (error) {
          console.error("Error validating CSV:", error);
          setValidationErrors([
            {
              row: 0,
              message: "Failed to validate CSV file. Please check the format.",
            },
          ]);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setValidationErrors([
          {
            row: 0,
            message: `Failed to parse CSV file: ${error.message}`,
          },
        ]);
      },
    });
  };

  // Process upload using batch insert for better performance
  const handleUpload = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors before uploading",
        variant: "destructive",
      });
      return;
    }

    if (!parsedData.length) {
      toast({
        title: "No data",
        description: "No valid data to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // First, get all existing investors by email to determine which to update vs. insert
      const emails = parsedData.map((investor) => investor.email);
      const { data: existingInvestors, error: fetchError } = await supabase
        .from("investors")
        .select("investor_id, email, type, company, wallet_address, kyc_status")
        .in("email", emails);

      if (fetchError) throw fetchError;

      // Create a map of email to existing investor for quick lookup
      const existingInvestorMap = new Map();
      existingInvestors?.forEach((investor) => {
        existingInvestorMap.set(investor.email.toLowerCase(), investor);
      });

      // Separate investors into those to update and those to insert
      const investorsToUpdate = [];
      const investorsToInsert = [];
      const now = new Date().toISOString();

      for (const investor of parsedData) {
        const existingInvestor = existingInvestorMap.get(
          investor.email.toLowerCase(),
        );

        if (existingInvestor) {
          // Update existing investor
          investorsToUpdate.push({
            investor_id: existingInvestor.investor_id,
            name: investor.name,
            type: investor.type || existingInvestor.type || "hnwi",
            company: investor.company || existingInvestor.company || null,
            wallet_address:
              investor.wallet_address ||
              existingInvestor.wallet_address ||
              null,
            kyc_status:
              investor.kyc_status ||
              existingInvestor.kyc_status ||
              "not_started",
            updated_at: now,
          });
        } else {
          // Create new investor
          investorsToInsert.push({
            name: investor.name,
            email: investor.email,
            type: investor.type || "hnwi",
            kyc_status: investor.kyc_status || "not_started",
            company: investor.company || null,
            wallet_address: investor.wallet_address || null,
            created_at: now,
            updated_at: now,
          });
        }
      }

      const processedInvestors = [];

      // Update progress to 25%
      setUploadProgress(25);

      // Batch insert new investors
      if (investorsToInsert.length > 0) {
        // Process in batches of 100 to avoid hitting limits
        const batchSize = 100;
        for (let i = 0; i < investorsToInsert.length; i += batchSize) {
          const batch = investorsToInsert.slice(i, i + batchSize);
          const { data: newInvestors, error: insertError } = await supabase
            .from("investors")
            .insert(batch)
            .select();

          if (insertError) throw insertError;
          if (newInvestors) processedInvestors.push(...newInvestors);

          // Update progress based on how many batches we've processed
          const insertProgress = Math.min(
            75,
            25 +
              Math.round(((i + batch.length) / investorsToInsert.length) * 50),
          );
          setUploadProgress(insertProgress);
        }
      }

      // Batch update existing investors
      if (investorsToUpdate.length > 0) {
        // Process in batches of 100
        const batchSize = 100;
        for (let i = 0; i < investorsToUpdate.length; i += batchSize) {
          const batch = investorsToUpdate.slice(i, i + batchSize);

          // We need to update one by one since upsert doesn't work with eq filter
          for (const investor of batch) {
            const { data: updatedInvestor, error: updateError } = await supabase
              .from("investors")
              .update({
                name: investor.name,
                type: investor.type,
                company: investor.company,
                wallet_address: investor.wallet_address,
                kyc_status: investor.kyc_status,
                updated_at: investor.updated_at,
              })
              .eq("investor_id", investor.investor_id)
              .select()
              .single();

            if (updateError) throw updateError;
            if (updatedInvestor) processedInvestors.push(updatedInvestor);
          }

          // Update progress based on how many batches we've processed
          const updateProgress = Math.min(
            100,
            75 +
              Math.round(((i + batch.length) / investorsToUpdate.length) * 25),
          );
          setUploadProgress(updateProgress);
        }
      }

      // Set progress to 100% when done
      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: `Processed ${processedInvestors.length} investors`,
        variant: "default",
      });

      // Reset state
      setFile(null);
      setParsedData([]);
      setValidationErrors([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Call the callback
      onUploadComplete(processedInvestors);
    } catch (error) {
      console.error("Error uploading investors:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while processing the investors",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Download sample template using PapaParse
  const downloadTemplate = () => {
    const sampleData = [
      {
        name: "John Doe",
        email: "john@example.com",
        type: "hnwi",
        company: "Acme Inc",
        wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
        kyc_status: "approved",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        type: "institutional_crypto",
        company: "Smith Capital",
        wallet_address: "0x2345678901abcdef2345678901abcdef23456789",
        kyc_status: "pending",
      },
      {
        name: "Global Ventures",
        email: "global@example.com",
        type: "private_equity",
        company: "Global Ventures LLC",
        wallet_address: "",
        kyc_status: "not_started",
      },
      {
        name: "Michael Johnson",
        email: "michael@example.com",
        type: "asset_managers",
        company: "Johnson Asset Management",
        wallet_address: "",
        kyc_status: "pending",
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        type: "hnwi",
        company: "",
        wallet_address: "",
        kyc_status: "not_started",
      },
    ];

    const csvContent = Papa.unparse(sampleData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "investor_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear file
  const clearFile = () => {
    setFile(null);
    setParsedData([]);
    setValidationErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Bulk Investor Upload</CardTitle>
        <CardDescription>
          Upload a CSV file containing multiple investor records at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drag & Drop CSV File</h3>
                <p className="text-sm text-muted-foreground">
                  or click the button below to browse files
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hasHeaders"
                  checked={hasHeaders}
                  onCheckedChange={(checked) => {
                    setHasHeaders(!!checked);
                    if (file) validateCsvFile(file);
                  }}
                />
                <Label htmlFor="hasHeaders" className="text-sm">
                  CSV file has header row
                </Label>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {parsedData.length} investors found
                </p>
              </div>
              {isUploading && (
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    Processing {uploadProgress}%
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearFile}
                  disabled={isUploading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear File
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || validationErrors.length > 0}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Process Investors
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              <div className="mt-2 max-h-[200px] overflow-y-auto">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview data */}
        {parsedData.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              Preview ({parsedData.length} investors)
            </h3>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Email</th>
                    <th className="px-4 py-2 text-left font-medium">Company</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">
                      KYC Status
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Wallet Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.email}</td>
                      <td className="px-4 py-2">{row.company || ""}</td>
                      <td className="px-4 py-2">{row.type || "hnwi"}</td>
                      <td className="px-4 py-2">
                        {row.kyc_status || "not_started"}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-[200px]">
                        {row.wallet_address || ""}
                      </td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-2 text-center text-muted-foreground"
                      >
                        ... and {parsedData.length - 5} more
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CSV format guide */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">CSV Format Guide</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Your CSV file should include the following columns:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>
              <strong>name</strong> (required): Full name of the investor
            </li>
            <li>
              <strong>email</strong> (required): Email address
            </li>
            <li>
              <strong>type</strong> (optional): Type of investor (hnwi,
              institutional_crypto, etc.)
            </li>
            <li>
              <strong>company</strong> (optional): Company or organization name
            </li>
            <li>
              <strong>wallet_address</strong> (optional): Ethereum wallet
              address (must start with 0x)
            </li>
            <li>
              <strong>kyc_status</strong> (optional): KYC status (not_started,
              pending, approved, failed, expired)
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || validationErrors.length > 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Investors"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkInvestorUpload;
