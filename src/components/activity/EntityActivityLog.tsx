import React, { useState, useEffect } from "react";
import { getEntityActivityLogs, ActivityLogEntry } from "@/lib/activityLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ActivityLogDetails from "./ActivityLogDetails";

interface EntityActivityLogProps {
  entityType: string;
  entityId: string;
  title?: string;
  limit?: number;
  className?: string;
}

const EntityActivityLog: React.FC<EntityActivityLogProps> = ({
  entityType,
  entityId,
  title = "Activity History",
  limit = 5,
  className = "",
}) => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load activity logs for this entity
  const loadLogs = async () => {
    setLoading(true);
    try {
      const fetchedLogs = await getEntityActivityLogs(
        entityType,
        entityId,
        expanded ? 20 : limit,
      );
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error loading entity activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load logs when component mounts or when expanded state changes
  useEffect(() => {
    loadLogs();
  }, [entityType, entityId, expanded, limit]);

  // Format timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm");
  };

  // Format action type for display
  const formatActionType = (actionType?: string) => {
    if (!actionType) return "";
    return actionType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get status badge color
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "failure":
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle log click to show details
  const handleLogClick = (log: ActivityLogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={loadLogs}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState message="Loading activity logs..." />
        ) : logs.length === 0 ? (
          <EmptyState
            title="No activity logs"
            description={`No activity has been recorded for this ${entityType} yet.`}
          />
        ) : (
          <div className="space-y-4">
            {logs.slice(0, expanded ? undefined : limit).map((log) => (
              <div
                key={log.id}
                className="border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/20 p-2 rounded-md transition-colors"
                onClick={() => handleLogClick(log)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm">
                    {formatActionType(log.action_type)}
                  </div>
                  <div>{getStatusBadge(log.status)}</div>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <div>{log.user_email || "System"}</div>
                  <div>{formatTimestamp(log.timestamp)}</div>
                </div>
              </div>
            ))}

            {logs.length > limit && (
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show More (
                    {logs.length - limit} more)
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <ActivityLogDetails
          log={selectedLog}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      </CardContent>
    </Card>
  );
};

export default EntityActivityLog;
