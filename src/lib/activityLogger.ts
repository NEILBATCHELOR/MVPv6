// ACTIVITY LOGGING COMPLETELY DISABLED

export interface ActivityLogEntry {
  action_type: string;
  user_id?: string;
  user_email?: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  status?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}

/**
 * Log an activity in the unified activity log - DISABLED
 */
export async function logActivity(
  entry: ActivityLogEntry,
): Promise<ActivityLogEntry | null> {
  // No-op implementation
  return null;
}

/**
 * Get activity logs with optional filtering - DISABLED
 */
export async function getActivityLogs(): Promise<ActivityLogEntry[]> {
  // Return empty array
  return [];
}

/**
 * Get activity logs for a specific entity - DISABLED
 */
export async function getEntityActivityLogs(): Promise<ActivityLogEntry[]> {
  // Return empty array
  return [];
}

/**
 * Get recent activity logs for the current user - DISABLED
 */
export async function getUserRecentActivity(): Promise<ActivityLogEntry[]> {
  // Return empty array
  return [];
}

/**
 * Export activity logs to CSV format - DISABLED
 */
export function exportLogsToCSV(): string {
  // Return empty CSV header
  return "Timestamp,User,Action,Entity Type,Entity ID,Status,Details\n";
}
