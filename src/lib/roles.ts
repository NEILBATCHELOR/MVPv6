import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Types
export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

// Get all roles for a user
export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching roles for user ${userId}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error in getUserRoles for user ${userId}:`, error);
    return [];
  }
};

// Add a role to a user
export const addUserRole = async (
  userId: string,
  role: string,
): Promise<UserRole> => {
  try {
    const now = new Date().toISOString();
    const id = uuidv4();

    const { data, error } = await supabase
      .from("user_roles")
      .insert({
        id,
        user_id: userId,
        role,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error adding role ${role} to user ${userId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in addUserRole for user ${userId}:`, error);
    throw error;
  }
};

// Remove a role from a user
export const removeUserRole = async (roleId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      console.error(`Error removing role with ID ${roleId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in removeUserRole for role ID ${roleId}:`, error);
    throw error;
  }
};

// Update a user's role
export const updateUserRole = async (
  roleId: string,
  newRole: string,
): Promise<UserRole> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("user_roles")
      .update({
        role: newRole,
        updated_at: now,
      })
      .eq("id", roleId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating role with ID ${roleId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in updateUserRole for role ID ${roleId}:`, error);
    throw error;
  }
};

// Get all users with a specific role
export const getUsersByRole = async (role: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", role);

    if (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }

    return data?.map((item) => item.user_id) || [];
  } catch (error) {
    console.error(`Error in getUsersByRole for role ${role}:`, error);
    return [];
  }
};
