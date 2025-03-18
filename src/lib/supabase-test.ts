import { createClient } from "@supabase/supabase-js";

// This file is used to test the Supabase connection
export async function testSupabaseConnection() {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

    console.log("Testing Supabase connection with:", {
      url: supabaseUrl ? "[URL AVAILABLE]" : "[URL MISSING]",
      key: supabaseAnonKey ? "[KEY AVAILABLE]" : "[KEY MISSING]",
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL or Anon Key is missing");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try a simple query to test the connection
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id")
      .limit(1);

    if (error) throw error;

    console.log("Supabase connection successful!", { data });
    return { success: true, message: "Connection successful" };
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return { success: false, message: error.message, error };
  }
}
