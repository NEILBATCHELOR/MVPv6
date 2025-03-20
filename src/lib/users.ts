import { supabase } from "./supabase";
import { User } from "@/types/users";
import { logActivity } from "./activityLogger";

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
    // 1. Create the user in auth.users
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role,
        },
      });

    if (authError) throw authError;
    if (!authUser.user) throw new Error("Failed to create user");

    // 2. Create entry in public.users table
    const { data: publicUser, error: publicUserError } = await supabase
      .from("users")
      .insert({
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: "active",
        public_key: userData.publicKey,
        encrypted_private_key: userData.encryptedPrivateKey,
      })
      .select()
      .single();

    if (publicUserError) throw publicUserError;

    // 3. Add role to user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authUser.user.id,
      role: userData.role,
    });

    if (roleError) throw roleError;

    // 4. Send invitation email if requested
    if (userData.sendInvitation) {
      await sendInvitationEmail(
        userData.email,
        userData.name,
        userData.role,
        userData.password,
      );
    }

    // 5. Log the user creation activity
    await logActivity({
      action_type: "user_created",
      entity_type: "user",
      entity_id: authUser.user.id,
      details: `User ${userData.name} (${userData.email}) created with role ${userData.role}`,
      status: "success",
    });

    return { user: authUser.user, publicUser };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function sendInvitationEmail(
  email: string,
  name: string,
  role: string,
  password: string,
) {
  try {
    // In a production environment, you would use a proper email service like SendGrid, Mailgun, etc.
    // For this implementation, we'll use Supabase Edge Functions to send emails

    const { error } = await supabase.functions.invoke("send-invitation-email", {
      body: {
        email,
        name,
        role,
        password,
        loginUrl: window.location.origin + "/login",
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error sending invitation email:", error);
    // Don't throw here - we don't want to fail user creation if email fails
    return false;
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, name, email, role, status, public_key, created_at, updated_at",
      )
      .order("name", { ascending: true });

    if (error) throw error;

    // Get MFA status for each user
    const usersWithMfa = await Promise.all(
      (data || []).map(async (user) => {
        const { data: mfaData, error: mfaError } = await supabase
          .from("user_mfa_settings")
          .select("enabled")
          .eq("user_id", user.id)
          .single();

        return {
          ...user,
          mfa_enabled: mfaError ? false : mfaData?.enabled || false,
        };
      }),
    );

    return usersWithMfa;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: Partial<User>) {
  try {
    // 1. Update user in auth.users if email is changing
    if (userData.email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { email: userData.email },
      );
      if (authError) throw authError;
    }

    // 2. Update user in public.users table
    const { data, error } = await supabase
      .from("users")
      .update({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // 3. Update role in user_roles table if role is changing
    if (userData.role) {
      // First delete existing role
      await supabase.from("user_roles").delete().eq("user_id", userId);

      // Then insert new role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: userData.role,
      });

      if (roleError) throw roleError;
    }

    // 4. Log the user update activity
    await logActivity({
      action_type: "user_updated",
      entity_type: "user",
      entity_id: userId,
      details: `User ${userData.name || data.name} updated`,
      status: "success",
    });

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    // 1. Get user details for logging
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // 2. Delete user from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 3. Delete from user_roles table
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // 4. Delete from users table
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;

    // 5. Log the user deletion activity
    await logActivity({
      action_type: "user_deleted",
      entity_type: "user",
      entity_id: userId,
      details: `User ${userData.name} (${userData.email}) deleted`,
      status: "success",
    });

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;

    // Log the password reset activity
    await logActivity({
      action_type: "password_reset",
      entity_type: "user",
      entity_id: userId,
      details: "User password was reset by administrator",
      status: "success",
    });

    return true;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
}

export async function changeUserStatus(
  userId: string,
  status: "active" | "suspended" | "revoked",
) {
  try {
    // 1. Update user status in public.users table
    const { data, error } = await supabase
      .from("users")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("name, email")
      .single();

    if (error) throw error;

    // 2. If status is suspended or revoked, invalidate all sessions
    if (status === "suspended" || status === "revoked") {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { ban_duration: status === "revoked" ? "forever" : "3600" },
      );
      if (authError) throw authError;
    } else if (status === "active") {
      // Unban the user if they were previously banned
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { ban_duration: null },
      );
      if (authError) throw authError;
    }

    // 3. Log the status change activity
    await logActivity({
      action_type: "user_status_changed",
      entity_type: "user",
      entity_id: userId,
      details: `User ${data.name} (${data.email}) status changed to ${status}`,
      status: "success",
    });

    return true;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw error;
  }
}
