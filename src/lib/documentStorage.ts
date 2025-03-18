import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export interface DocumentMetadata {
  id: string;
  name: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "not_submitted"
    | "not_uploaded";
  dateUpdated: string;
  description?: string;
  rejectionReason?: string;
  fileUrl?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  userId?: string;
  organizationId?: string;
  required?: boolean;
}

// Empty document storage array - all documents will be stored in Supabase
let documents: DocumentMetadata[] = [];

export const uploadDocument = async (
  file: File,
  metadata: Partial<DocumentMetadata>,
  userId: string = "default-user",
  organizationId: string = "default-org",
): Promise<DocumentMetadata> => {
  try {
    // Generate a mock file URL
    const fileUrl = `https://example.com/mock-${file.name}`;

    // Create document metadata
    const documentMetadata: DocumentMetadata = {
      id: metadata.id || uuidv4(),
      name: metadata.name || file.name,
      status: "pending",
      dateUpdated: new Date().toISOString(),
      description: metadata.description || "",
      fileUrl,
      filePath: `mock-path/${file.name}`,
      fileType: file.type,
      fileSize: file.size,
      userId,
      organizationId,
      ...metadata,
    };

    // We'll only use Supabase for document storage, no local caching

    // Try to use Supabase if available, but don't fail if it's not
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${organizationId}/${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        // Get the public URL for the file
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);

        documentMetadata.fileUrl = urlData.publicUrl;
        documentMetadata.filePath = filePath;

        // Store metadata in Supabase Database
        await supabase.from("documents").insert([documentMetadata]).select();
      }
    } catch (e) {
      console.warn("Using mock document storage", e);
    }

    return documentMetadata;
  } catch (error) {
    console.error("Document upload failed:", error);
    throw error;
  }
};

export const getDocuments = async (
  userId: string = "default-user",
  organizationId: string = "default-org",
): Promise<DocumentMetadata[]> => {
  try {
    // Try to use Supabase if available
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("organizationId", organizationId)
        .order("dateUpdated", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as DocumentMetadata[];
      }
    } catch (e) {
      console.warn("Using mock document storage", e);
    }

    // Return empty array if Supabase fetch fails
    return [];
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return []; // Return empty array instead of mock data
  }
};

export const updateDocumentStatus = async (
  documentId: string,
  status: DocumentMetadata["status"],
  rejectionReason?: string,
): Promise<DocumentMetadata | null> => {
  try {
    const updateData: Partial<DocumentMetadata> = {
      status,
      dateUpdated: new Date().toISOString(),
    };

    if (rejectionReason && status === "rejected") {
      updateData.rejectionReason = rejectionReason;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Error updating document status:", e);
    }

    return null;
  } catch (error) {
    console.error("Failed to update document status:", error);
    return null;
  }
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    try {
      // First get the document to get the file path
      const { data: document, error: fetchError } = await supabase
        .from("documents")
        .select("filePath")
        .eq("id", documentId)
        .single();

      if (fetchError) throw fetchError;

      // Remove the file from storage if it exists
      if (document?.filePath) {
        await supabase.storage.from("documents").remove([document.filePath]);
      }

      // Delete the document record
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Error deleting document:", e);
      return false;
    }
  } catch (error) {
    console.error("Failed to delete document:", error);
    return false;
  }
};

// Get document templates based on user type
export const getDocumentTemplates = (
  userType: "issuer" | "investor",
): DocumentMetadata[] => {
  const commonDocuments: DocumentMetadata[] = [
    {
      id: "proof_identity",
      name: "Government-Issued ID",
      description: "Passport, driver's license, or national ID card",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "proof_address",
      name: "Proof of Address",
      description: "Utility bill, bank statement (less than 3 months old)",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
  ];

  const issuerDocuments: DocumentMetadata[] = [
    {
      id: "certificate_incorporation",
      name: "Certificate of Incorporation",
      description: "Official document proving company registration",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "articles_association",
      name: "Articles of Association",
      description: "Company bylaws and operating rules",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "shareholder_register",
      name: "Shareholder Register",
      description: "List of all shareholders and their ownership percentages",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "director_list",
      name: "List of Directors",
      description: "Official list of company directors",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "financial_statements",
      name: "Financial Statements",
      description: "Recent audited financial statements",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: false,
    },
    {
      id: "regulatory_licenses",
      name: "Regulatory Licenses",
      description: "Any financial or business licenses held",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: false,
    },
  ];

  const investorDocuments: DocumentMetadata[] = [
    {
      id: "accreditation_proof",
      name: "Accreditation Proof",
      description: "Documentation proving accredited investor status",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "source_wealth",
      name: "Source of Wealth Statement",
      description: "Documentation explaining source of investment funds",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
    {
      id: "tax_documents",
      name: "Tax Documents",
      description: "W-8BEN, W-9, or equivalent tax forms",
      status: "not_uploaded",
      dateUpdated: new Date().toISOString(),
      required: true,
    },
  ];

  // Return documents based on user type
  if (userType === "issuer") {
    return [...commonDocuments, ...issuerDocuments];
  } else {
    return [...commonDocuments, ...investorDocuments];
  }
};
