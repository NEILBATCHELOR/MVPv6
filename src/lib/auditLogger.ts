// AUDIT LOGGING COMPLETELY DISABLED

export interface AuditLog {
  id?: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: string;
  signature?: string;
  verified?: boolean;
  entity_type?: string;
  entity_id?: string;
  old_data?: any;
  new_data?: any;
}

// No-op implementation of audit logging functions
export async function logAction(
  action: string,
  user: string,
  details: string,
  status: string = "Success",
  privateKey?: string,
  entityType?: string,
  entityId?: string,
  newData?: any,
): Promise<AuditLog> {
  // Return a dummy log entry without doing anything
  return {
    id: "disabled",
    timestamp: new Date().toISOString(),
    action,
    user: "system", // Always use system to avoid null constraint violations
    details,
    status,
    entity_type: entityType,
    entity_id: entityId,
  };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  // Return empty array
  return [];
}

export async function exportAuditLogs(): Promise<string> {
  // Return empty string
  return "";
}
