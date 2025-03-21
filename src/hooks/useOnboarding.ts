import { useState, useCallback } from "react";
import { onboardingApi } from "../lib/api/onboardingApi";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingData {
  id?: string;
  name: string;
  email: string;
  type: string; // "issuer" or "investor"
  status: string;
  metadata?: Record<string, any>;
  documents?: DocumentData[];
}

interface DocumentData {
  id?: string;
  name: string;
  type: string;
  status: string;
  file_path?: string;
  file_url?: string;
  file?: File;
  entity_id?: string;
  entity_type?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export function useOnboarding() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create entity (issuer or investor)
  const createEntity = useCallback(
    async (data: OnboardingData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.createEntity(data);
        toast({
          title: "Success",
          description: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} created successfully`,
        });
        return result;
      } catch (err: any) {
        setError(err.message || `Failed to create ${data.type}`);
        toast({
          title: "Error",
          description: err.message || `Failed to create ${data.type}`,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get entity by ID
  const getEntityById = useCallback(
    async (type: "issuer" | "investor", id: string) => {
      setLoading(true);
      setError(null);
      try {
        return await onboardingApi.getEntityById(type, id);
      } catch (err: any) {
        setError(err.message || `Failed to get ${type}`);
        toast({
          title: "Error",
          description: err.message || `Failed to get ${type}`,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get all entities
  const getAllEntities = useCallback(
    async (type: "issuer" | "investor", filters?: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        return await onboardingApi.getAllEntities(type, filters);
      } catch (err: any) {
        setError(err.message || `Failed to get ${type}s`);
        toast({
          title: "Error",
          description: err.message || `Failed to get ${type}s`,
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Update entity
  const updateEntity = useCallback(
    async (
      type: "issuer" | "investor",
      id: string,
      data: Partial<OnboardingData>,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.updateEntity(type, id, data);
        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`,
        });
        return result;
      } catch (err: any) {
        setError(err.message || `Failed to update ${type}`);
        toast({
          title: "Error",
          description: err.message || `Failed to update ${type}`,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Delete entity
  const deleteEntity = useCallback(
    async (type: "issuer" | "investor", id: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.deleteEntity(type, id);
        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
        });
        return result;
      } catch (err: any) {
        setError(err.message || `Failed to delete ${type}`);
        toast({
          title: "Error",
          description: err.message || `Failed to delete ${type}`,
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Upload document
  const uploadDocument = useCallback(
    async (docData: DocumentData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.uploadDocument(docData);
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });
        return result;
      } catch (err: any) {
        setError(err.message || "Failed to upload document");
        toast({
          title: "Error",
          description: err.message || "Failed to upload document",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get document by ID
  const getDocumentById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        return await onboardingApi.getDocumentById(id);
      } catch (err: any) {
        setError(err.message || "Failed to get document");
        toast({
          title: "Error",
          description: err.message || "Failed to get document",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Update document
  const updateDocument = useCallback(
    async (id: string, data: Partial<DocumentData>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.updateDocument(id, data);
        toast({
          title: "Success",
          description: "Document updated successfully",
        });
        return result;
      } catch (err: any) {
        setError(err.message || "Failed to update document");
        toast({
          title: "Error",
          description: err.message || "Failed to update document",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Delete document
  const deleteDocument = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.deleteDocument(id);
        toast({
          title: "Success",
          description: "Document deleted successfully",
        });
        return result;
      } catch (err: any) {
        setError(err.message || "Failed to delete document");
        toast({
          title: "Error",
          description: err.message || "Failed to delete document",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Get entity documents
  const getEntityDocuments = useCallback(
    async (entityType: string, entityId: string) => {
      setLoading(true);
      setError(null);
      try {
        return await onboardingApi.getEntityDocuments(entityType, entityId);
      } catch (err: any) {
        setError(err.message || "Failed to get documents");
        toast({
          title: "Error",
          description: err.message || "Failed to get documents",
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Update entity status
  const updateEntityStatus = useCallback(
    async (type: "issuer" | "investor", id: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.updateEntityStatus(type, id, status);
        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} status updated successfully`,
        });
        return result;
      } catch (err: any) {
        setError(err.message || `Failed to update ${type} status`);
        toast({
          title: "Error",
          description: err.message || `Failed to update ${type} status`,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Update document status
  const updateDocumentStatus = useCallback(
    async (id: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await onboardingApi.updateDocumentStatus(id, status);
        toast({
          title: "Success",
          description: "Document status updated successfully",
        });
        return result;
      } catch (err: any) {
        setError(err.message || "Failed to update document status");
        toast({
          title: "Error",
          description: err.message || "Failed to update document status",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    loading,
    error,
    createEntity,
    getEntityById,
    getAllEntities,
    updateEntity,
    deleteEntity,
    uploadDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getEntityDocuments,
    updateEntityStatus,
    updateDocumentStatus,
  };
}
