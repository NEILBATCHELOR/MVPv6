import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export const onboardingApi = {
  // Entity management (issuer/investor)
  async createEntity(data: any) {
    try {
      const { data: entity, error } = await supabase
        .from(`${data.type}s`) // 'issuers' or 'investors'
        .insert({
          id: data.id || uuidv4(),
          name: data.name,
          email: data.email,
          status: data.status || "pending",
          metadata: data.metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return entity;
    } catch (error) {
      console.error(`Error creating ${data.type}:`, error);
      throw error;
    }
  },

  async getEntityById(type: string, id: string) {
    try {
      const { data, error } = await supabase
        .from(`${type}s`) // 'issuers' or 'investors'
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting ${type} by ID:`, error);
      throw error;
    }
  },

  async getAllEntities(type: string, filters?: Record<string, any>) {
    try {
      let query = supabase
        .from(`${type}s`) // 'issuers' or 'investors'
        .select("*");

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error getting all ${type}s:`, error);
      throw error;
    }
  },

  async updateEntity(type: string, id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from(`${type}s`) // 'issuers' or 'investors'
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      throw error;
    }
  },

  async deleteEntity(type: string, id: string) {
    try {
      const { error } = await supabase
        .from(`${type}s`) // 'issuers' or 'investors'
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      throw error;
    }
  },

  async updateEntityStatus(type: string, id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from(`${type}s`) // 'issuers' or 'investors'
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      throw error;
    }
  },

  // Document management
  async uploadDocument(docData: any) {
    try {
      // First, upload the file to storage if provided
      let filePath = null;
      let fileUrl = null;

      if (docData.file) {
        const fileExt = docData.file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        filePath = `${docData.entity_type}/${docData.entity_id}/${fileName}`;

        // Upload file to storage directly using Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, docData.file);

        if (uploadError) throw uploadError;

        // Get the public URL directly from Supabase
        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        fileUrl = data.publicUrl;
      }

      // Then create the document record
      const { data, error } = await supabase
        .from("documents")
        .insert({
          name: docData.name,
          type: docData.type,
          status: docData.status || "pending",
          file_path: filePath,
          file_url: fileUrl,
          entity_id: docData.entity_id,
          entity_type: docData.entity_type,
          metadata: docData.metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  async getDocumentById(id: string) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting document by ID:", error);
      throw error;
    }
  },

  async updateDocument(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  async deleteDocument(id: string) {
    try {
      // First get the document to get the file path
      const { data: document, error: fetchError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Remove the file from storage if it exists
      if (document?.file_path) {
        const { error: removeError } = await supabase.storage
          .from("documents")
          .remove([document.file_path]);

        if (removeError) throw removeError;
      }

      // Delete the document record
      const { error } = await supabase.from("documents").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  async getEntityDocuments(entityType: string, entityId: string) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting entity documents:", error);
      throw error;
    }
  },

  async updateDocumentStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating document status:", error);
      throw error;
    }
  },
};
