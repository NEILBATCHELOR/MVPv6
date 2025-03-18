import React, { useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import realtimeService from "@/services/realtimeService";

interface RedemptionStatusSubscriberProps {
  requestId: string;
  investorId?: string;
  onStatusChange?: (status: string) => void;
  onApprovalChange?: (approvers: any[]) => void;
}

/**
 * A component that subscribes to real-time updates for a redemption request
 * This is a "headless" component that doesn't render anything visible
 */
const RedemptionStatusSubscriber: React.FC<RedemptionStatusSubscriberProps> = ({
  requestId,
  investorId,
  onStatusChange,
  onApprovalChange,
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Subscribe to status changes
    const statusSubscriptionId = realtimeService.subscribeToRedemptionStatus(
      requestId,
      (newStatus) => {
        // Call the callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }

        // Notifications disabled to reduce distractions
      },
    );

    // Subscribe to approval changes if needed
    let approvalSubscriptionId: string | undefined;
    if (onApprovalChange) {
      approvalSubscriptionId = realtimeService.subscribeToApprovals(
        requestId,
        (approvers) => {
          onApprovalChange(approvers);

          // Approval notifications disabled to reduce distractions
        },
      );
    }

    // Subscribe to all investor redemptions if investorId is provided
    let investorSubscriptionId: string | undefined;
    if (investorId) {
      investorSubscriptionId = realtimeService.subscribeToInvestorRedemptions(
        investorId,
        (redemptions) => {
          // This could be used to update a list of redemptions in a parent component
          // We don't need to do anything with it here
        },
      );
    }

    // Clean up subscriptions when component unmounts
    return () => {
      realtimeService.unsubscribe(statusSubscriptionId);
      if (approvalSubscriptionId) {
        realtimeService.unsubscribe(approvalSubscriptionId);
      }
      if (investorSubscriptionId) {
        realtimeService.unsubscribe(investorSubscriptionId);
      }
    };
  }, [
    requestId,
    investorId,
    onStatusChange,
    onApprovalChange,
    addNotification,
  ]);

  // This component doesn't render anything
  return null;
};

export default RedemptionStatusSubscriber;
