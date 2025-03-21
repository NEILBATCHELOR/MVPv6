import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploader from "@/components/shared/DocumentUploader";
import DocumentList from "@/components/shared/DocumentList";

interface DocumentManagementProps {
  entityId: string;
  entityType: "issuer" | "investor";
  documentTypes?: string[];
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({
  entityId,
  entityType,
  documentTypes = [
    "Identification",
    "Proof of Address",
    "Financial Statement",
    "Corporate Document",
    "Tax Document",
    "Other",
  ],
}) => {
  const [activeTab, setActiveTab] = useState(documentTypes[0]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    // Trigger a refresh of the document list
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDocumentAction = (action: string, document: any) => {
    console.log(`Document action: ${action}`, document);
    // You can add additional logic here if needed
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            {documentTypes.map((type) => (
              <TabsTrigger key={type} value={type}>
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {documentTypes.map((type) => (
            <TabsContent key={type} value={type} className="space-y-6">
              <DocumentUploader
                entityId={entityId}
                entityType={entityType}
                documentType={type}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentList
                entityId={entityId}
                entityType={entityType}
                onDocumentAction={handleDocumentAction}
                refreshTrigger={refreshTrigger}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentManagement;
