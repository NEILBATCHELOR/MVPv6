import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, X, File, Loader2 } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

interface DocumentUploaderProps {
  entityId: string;
  entityType: "issuer" | "investor";
  documentType: string;
  onUploadComplete?: (document: any) => void;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  entityId,
  entityType,
  documentType,
  onUploadComplete,
  allowedFileTypes = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
  maxFileSizeMB = 10,
}) => {
  const { toast } = useToast();
  const { uploadDocument, loading } = useOnboarding();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File size exceeds the maximum limit of ${maxFileSizeMB}MB`,
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!allowedFileTypes.includes(fileExt)) {
        toast({
          title: "Invalid file type",
          description: `Allowed file types: ${allowedFileTypes.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      // Set default document name from file name (without extension)
      const fileName = file.name.split(".").slice(0, -1).join(".");
      setDocumentName(fileName || "Document");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and provide a document name",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await uploadDocument({
        name: documentName,
        type: documentType,
        status: "pending",
        file: selectedFile,
        entity_id: entityId,
        entity_type: entityType,
      });

      if (result && onUploadComplete) {
        onUploadComplete(result);
      }

      // Reset form
      setSelectedFile(null);
      setDocumentName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setDocumentName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-upload">Upload {documentType}</Label>

        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: {allowedFileTypes.join(", ")} (Max:{" "}
              {maxFileSizeMB}MB)
            </p>
            <Input
              id="document-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={allowedFileTypes.join(",")}
            />
          </div>
        ) : (
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                  <File className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <Button
          onClick={handleUpload}
          disabled={loading || !documentName.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>Upload Document</>
          )}
        </Button>
      )}
    </Card>
  );
};

export default DocumentUploader;
