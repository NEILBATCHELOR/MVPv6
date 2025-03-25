import React, { createContext, useContext, ReactNode } from "react";
import { ActivityLogEntry } from "@/lib/activityLogger";

interface ActivityLogContextType {
  logUserActivity: (
    entry: Omit<ActivityLogEntry, "user_id" | "user_email">,
  ) => Promise<void>;
  logSystemActivity: (
    entry: Omit<ActivityLogEntry, "user_id" | "user_email">,
  ) => Promise<void>;
}

const ActivityLogContext = createContext<ActivityLogContextType>({
  logUserActivity: async () => {},
  logSystemActivity: async () => {},
});

export const useActivityLog = () => useContext(ActivityLogContext);

interface ActivityLogProviderProps {
  children: ReactNode;
}

const ActivityLogProvider = ({ children }: ActivityLogProviderProps) => {
  // No-op implementation - logging disabled
  const logUserActivity = async () => {};
  const logSystemActivity = async () => {};

  return (
    <ActivityLogContext.Provider
      value={{
        logUserActivity,
        logSystemActivity,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
};

export default ActivityLogProvider;
