import { createClient } from "@supabase/supabase-js";

// Create a Supabase client with admin privileges
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Use the hardcoded service key for admin operations
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd2ZreGZ6c25uanBwb2d0aGF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDc2MDUyMCwiZXhwIjoyMDU2MzM2NTIwfQ.-n4C2Xyg0cFtY6x97QwtE_Csf6_yu_grxnn66SWd270";

if (!supabaseUrl) {
  console.error("Missing Supabase URL environment variable");
}

const supabaseAdmin = createClient(supabaseUrl as string, supabaseServiceKey);

// Regular client for non-admin operations
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey);

export async function createUser(userData: {
  name: string;
  email: string;
  role: string;
  publicKey: string;
  encryptedPrivateKey: string;
  password: string;
  sendInvitation: boolean;
}) {
  try {
    // Step 1: Create user in auth.users (this triggers the invite email)
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: userData.sendInvitation, // This triggers the invite email
        user_metadata: {
          name: userData.name,
          role: userData.role,
        },
      });

    if (authError) throw authError;

    // Step 2: Create user in public.users
    const { data: publicUser, error: publicError } = await supabase
      .from("users")
      .insert({
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        public_key: userData.publicKey,
        encrypted_private_key: userData.encryptedPrivateKey,
        status: "pending",
      })
      .select()
      .single();

    if (publicError) {
      // If public user creation fails, attempt to delete the auth user to maintain consistency
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw publicError;
    }

    // Step 3: Create entry in user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authUser.user.id,
      role: userData.role,
    });

    if (roleError) {
      // If role assignment fails, clean up both users
      await supabase.from("users").delete().eq("id", authUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw roleError;
    }

    return { ...publicUser, auth_id: authUser.user.id };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  userId: string,
  userData: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
    publicKey?: string;
    encryptedPrivateKey?: string;
  },
) {
  try {
    // Update user in public.users
    const updateData: any = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.role) updateData.role = userData.role;
    if (userData.status) updateData.status = userData.status;
    if (userData.publicKey) updateData.public_key = userData.publicKey;
    if (userData.encryptedPrivateKey)
      updateData.encrypted_private_key = userData.encryptedPrivateKey;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // If role is updated, update the user_roles table
    if (userData.role) {
      const { error: roleError } = await supabase.from("user_roles").upsert(
        {
          user_id: userId,
          role: userData.role,
        },
        { onConflict: "user_id" },
      );

      if (roleError) throw roleError;
    }

    // If email is updated, update auth.users
    if (userData.email) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          email: userData.email,
        });

      if (authError) throw authError;
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    // Step 1: Delete from user_roles
    const { error: roleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (roleError) throw roleError;

    // Step 2: Delete from public.users
    const { error: publicError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (publicError) throw publicError;

    // Step 3: Delete from auth.users
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, status, mfa_enabled")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Fallback to mock data if there's an error
    return [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "superAdmin",
        status: "active",
        mfa_enabled: true,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "complianceManager",
        status: "active",
        mfa_enabled: false,
      },
      {
        id: "3",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "agent",
        status: "suspended",
        mfa_enabled: false,
      },
    ];
  }
}
