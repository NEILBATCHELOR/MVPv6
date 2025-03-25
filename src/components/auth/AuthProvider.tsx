import React, { createContext, useContext, ReactNode } from "react";

// Completely disabled AuthProvider
interface AuthContextType {
  session: any | null;
  user: any | null;
  userRole: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; userId: string | null }>;
  signUp: (
    email: string,
    password: string,
    role: string,
    userData?: any,
  ) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userRole: null,
  loading: false,
  signIn: async () => ({ success: true, userId: "admin-bypass" }),
  signUp: async () => ({ success: true }),
  signOut: async () => {},
  resetPassword: async () => ({ success: true }),
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // No-op implementation - auth disabled
  // Always returns admin bypass
  const signIn = async () => {
    localStorage.setItem("adminBypass", "true");
    return { success: true, userId: "admin-bypass" };
  };

  const signUp = async () => ({ success: true });
  const signOut = async () => {};
  const resetPassword = async () => ({ success: true });

  return (
    <AuthContext.Provider
      value={{
        session: { user: { id: "admin-bypass" } },
        user: { id: "admin-bypass", email: "admin@example.com" },
        userRole: "admin",
        loading: false,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
