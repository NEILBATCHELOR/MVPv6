import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Use Real Supabase Client Instead of Mock Client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth functions disabled - always return success
export async function getUserRoles() {
  return [{ role: "admin" }];
}

// Audit logging disabled
export async function logAction() {
  return;
}

// Storage functions remain active
export async function uploadDocument(file, path) {
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, file);
  if (error) throw error;
  return data;
}

export async function getPublicUrl(filePath) {
  return supabase.storage.from("documents").getPublicUrl(filePath).data
    .publicUrl;
}

export async function removeDocument(filePath) {
  const { error } = await supabase.storage.from("documents").remove([filePath]);
  if (error) throw error;
  return true;
}
